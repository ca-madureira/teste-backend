import { Request, Response } from 'express';
import {
  isBase64,
  isDatetime,
  isString,
  isTypeMeasure,
  isInteger,
} from '../utils/validateData';
import { Measure } from '../models/measure.model';
import { Customer } from '../models/customer.model';
import { TemporaryImage } from '../models/temporaryImage.model';
import {
  analyzeImage,
  valueConsumption,
  generateTemporaryLink,
} from '../utils/apiGemini';
import mongoose from 'mongoose';

export const uploadMeasure = async (req: Request, res: Response) => {
  try {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    if (
      !isBase64(image) ||
      !isString(customer_code) ||
      !isDatetime(measure_datetime) ||
      !isTypeMeasure(measure_type)
    ) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description: 'Tipo de dado inválido',
      });
    }

    const measureDate = new Date(measure_datetime);

    const customer = await Customer.findOne({ customer_code }).populate(
      'measures',
    );

    if (!customer) {
      return res.status(404).json({
        error_code: 'CUSTOMER_NOT_FOUND',
        error_description: 'Cliente não encontrado',
      });
    }

    const existingMeasure = await Measure.findOne({
      _id: { $in: customer.measures },
      measure_type,
      $expr: {
        $and: [
          {
            $eq: [{ $month: '$measure_datetime' }, measureDate.getMonth() + 1],
          },
          { $eq: [{ $year: '$measure_datetime' }, measureDate.getFullYear()] },
        ],
      },
    });

    if (existingMeasure) {
      return res.status(409).json({
        error_code: 'DOUBLE_REPORT',
        error_description: 'Leitura do mês já realizada para este cliente',
      });
    }

    const geminiAnalysis = await analyzeImage(image);
    const consumption = await valueConsumption(geminiAnalysis);
    const link = await generateTemporaryLink(image);

    const newMeasure = new Measure({
      image,
      measure_datetime,
      measure_type,
      has_confirmed: true,
      confirmed_value: consumption,
    });

    await newMeasure.save();

    customer.measures.push(newMeasure._id as mongoose.Types.ObjectId);
    await customer.save();

    return res.status(200).json({
      image_url: link,
      measure_value: consumption,
      measure_uuid: newMeasure._id,
    });
  } catch (error) {
    console.error('Erro ao processar a leitura:', error);
    return res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro interno do servidor',
    });
  }
};

export const confirmMeasure = async (req: Request, res: Response) => {
  try {
    const { measure_id, confirmed_value } = req.body;

    if (!isString(measure_id) || !isInteger(confirmed_value)) {
      return res.status(400).json({
        error_code: 'INVALID_DATA',
        error_description:
          'ID da medida inválido ou valor confirmado não é um número inteiro',
      });
    }

    const measure = await Measure.findOne({ _id: measure_id });

    if (!measure) {
      return res.status(404).json({
        error_code: 'MEASURE_NOT_FOUND',
        error_description: 'Leitura do mês não encontrada',
      });
    }

    if (measure.has_confirmed) {
      return res.status(409).json({
        error_code: 'CONFIRMATION_DUPLICATE',
        error_description: 'Leitura do mês já realizada',
      });
    }

    measure.has_confirmed = true;
    measure.confirmed_value = confirmed_value;
    await measure.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Ocorreu um erro ao confirmar a leitura.',
    });
  }
};

export const getMeasures = async (req: Request, res: Response) => {
  try {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    const query: any = { customer_code };

    if (measure_type) {
      if (!isTypeMeasure(measure_type)) {
        return res.status(400).json({
          error_code: 'INVALID_TYPE',
          error_description: 'Tipo de medição não permitida',
        });
      }

      query['measures.measure_type'] = measure_type;
    }

    const customer = await Customer.findOne(query).populate('measures');

    if (!customer || customer.measures.length === 0) {
      return res.status(404).json({
        error_code: 'MEASURES_NOT_FOUND',
        error_description: 'Nenhuma leitura encontrada',
      });
    }

    const response = {
      customer_code: customer.customer_code,
      measures: customer.measures.map((measure: any) => ({
        measure_uuid: measure._id,
        measure_datetime: measure.measure_datetime,
        measure_type: measure.measure_type,
        has_confirmed: measure.has_confirmed,
        image_url: measure.image_url,
      })),
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro no servidor',
    });
  }
};

export const getLinkTemporary = async (req: Request, res: Response) => {
  const imageId = req.params.id;

  try {
    const imageDoc = await TemporaryImage.findById(imageId);

    if (!imageDoc) {
      return res.status(404).json({
        error_code: 'IMAGE_EXPIRED',
        error_description: 'Imagem expirada',
      });
    }

    return res.status(200).json(imageDoc);
  } catch (error) {
    return res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro no servidor',
    });
  }
};
