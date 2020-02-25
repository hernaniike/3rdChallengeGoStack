import { Op } from 'sequelize';
import {
  setHours,
  setMinutes,
  setSeconds,
  format,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  parseISO,
  startOfHour,
  getHours,
} from 'date-fns';
import Order from '../models/Order';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Deliveryguy from '../models/Deliveryguy';

class DeliveryguyController {
  async index(req, res) {
    const { id } = req.params;
    const deliveryguyIdExist = await Deliveryguy.findOne({ where: { id } });
    if (!deliveryguyIdExist) {
      return res
        .status(400)
        .json({ error: 'This Delivery guy does not exist.' });
    }
    const orders = await Order.findAll({
      where: { deliveryman_id: id, canceled_at: null, end_date: null },
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'number',
            'street',
            'complement',
            'state',
            'city',
            'zip',
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(orders);
  }

  async delivered(req, res) {
    const { id } = req.params;
    const deliveryguyIdExist = await Deliveryguy.findOne({ where: { id } });
    if (!deliveryguyIdExist) {
      return res
        .status(400)
        .json({ error: 'This Delivery guy does not exist.' });
    }
    const orders = await Order.findAll({
      where: {
        deliveryman_id: id,
        end_date: { [Op.ne]: null },
      },
    });
    return res.json(orders);
  }

  async updateStart(req, res) {
    const { deliveryguyId, orderId } = req.params;
    const deliveryguyIdExist = await Deliveryguy.findOne({
      where: {
        id: deliveryguyId,
      },
    });
    if (!deliveryguyIdExist) {
      return res
        .status(400)
        .json({ error: 'This Delivery guy does not exist.' });
    }
    const orderIdExist = await Order.findOne({
      where: {
        id: orderId,
      },
    });
    if (!orderIdExist) {
      return res.status(400).json({ error: 'This Order does not exist.' });
    }

    if (orderIdExist.start_date !== null) {
      return res.status(400).json({
        error: 'This order has started already so you cannot started it again',
      });
    }

    const today = new Date().valueOf();
    const todayWithdraws = await Order.findAll({
      where: {
        deliveryman_id: deliveryguyId,
        start_date: {
          [Op.between]: [startOfDay(today), endOfDay(today)],
        },
      },
    });

    // Checking if the max withdraw per day is reached
    if (todayWithdraws.length >= 5) {
      return res.status(400).json({
        error: 'You can only withdraw up to 5 deliveries per day',
      });
    }

    const start_date = new Date();
    const hourStart = startOfHour(start_date);
    const HourDelivery = getHours(hourStart);
    const allowStart = isAfter(HourDelivery, 7) && isBefore(HourDelivery, 19);

    if (allowStart) {
      await orderIdExist.update({
        start_date,
      });
    }

    return res.json(orderIdExist);
  }

  async updateEnd(req, res) {
    const { deliveryguyId, orderId } = req.params;
    const deliveryguyIdExist = await Deliveryguy.findOne({
      where: {
        id: deliveryguyId,
      },
    });
    if (!deliveryguyIdExist) {
      return res
        .status(400)
        .json({ error: 'This Delivery guy does not exist.' });
    }
    const orderIdExist = await Order.findOne({
      where: {
        id: orderId,
      },
    });
    if (!orderIdExist) {
      return res.status(400).json({ error: 'This Order does not exist.' });
    }

    if (orderIdExist.deliveryman_id !== deliveryguyIdExist.id) {
      return res
        .status(400)
        .json({ error: 'This Order does not belong to you.' });
    }

    if (!(orderIdExist.end_date === null)) {
      return res.status(400).json({
        error: 'This order has already finished, you cannot change again!',
      });
    }

    if (orderIdExist.start_date === null) {
      return res.status(400).json({
        error:
          'This order has not started yet so you cannot finish it before you starter it',
      });
    }

    const { originalname: name, filename: path } = req.file;
    await File.create({
      name,
      path,
    });
    const signature = await File.findOne({
      where: { path },
    });
    const signatureId = signature.id;
    const end_date = new Date();
    await orderIdExist.update({
      signature_id: signatureId,
      end_date,
    });

    return res.json({ orderIdExist });
  }
}
export default new DeliveryguyController();
