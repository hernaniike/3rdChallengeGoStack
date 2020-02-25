import * as Yup from 'yup';
import Mail from '../../lib/Mail';
import Order from '../models/Order';
import File from '../models/File';
import Recipient from '../models/Recipient';
import DeliveryGuy from '../models/Deliveryguy';

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
      signature_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fail!' });
    }

    const { recipient_id, deliveryman_id, product, signature_id } = req.body;
    const recipientExists = await Recipient.findOne({
      where: { id: recipient_id },
    });
    const deliveryguyExists = await DeliveryGuy.findOne({
      where: { id: deliveryman_id },
    });
    if (!recipientExists) {
      return res.status(400).json({ error: 'This recipient does not exist!' });
    }
    if (!deliveryguyExists) {
      return res
        .status(400)
        .json({ error: 'This Delivery Guy does not exist!' });
    }

    const order = await Order.create({
      recipient_id,
      deliveryman_id,
      product,
      signature_id,
    });
    const { name, email } = await DeliveryGuy.findOne({
      where: { id: deliveryman_id },
    });
    await Mail.sendMail({
      to: `${name} <${email}>`,
      subject: 'You`ve got a New Order',
      template: 'newOrder',
      context: {
        deliveryguy: name,
        product,
        recipient: recipientExists.name,
      },
    });
    return res.json(order);
  }

  async index(req, res) {
    const orders = await Order.findAll({
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'signature_id',
        'deliveryman_id',
        'recipient_id',
      ],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'name', 'path'],
        },
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
          model: DeliveryGuy,
          as: 'deliveryguy',
          attributes: ['name', 'email'],
        },
      ],
    });
    return res.json(orders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number(),
      deliveryman_id: Yup.number(),
      product: Yup.string(),
      signature_id: Yup.number(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      canceled_at: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const { id } = req.body;
    const order = await Order.findOne({ where: { id } });

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    const {
      recipient_id: oldrecipientId,
      deliveryman_id: olddeliverymanId,
      product: oldproduct,
      signature_id: oldsignatureId,
    } = order;
    const {
      recipient_id,
      deliveryman_id,
      product,
      signature_id,
      start_date,
      end_date,
      canceled_at,
    } = req.body;

    let newrecipientId;
    let newdeliverymanId;
    let newproduct;
    let newsignatureId;

    if (recipient_id && recipient_id !== oldrecipientId) {
      newrecipientId = recipient_id;
    } else newrecipientId = oldrecipientId;

    if (deliveryman_id && deliveryman_id !== olddeliverymanId) {
      newdeliverymanId = deliveryman_id;
    } else newdeliverymanId = olddeliverymanId;

    if (product && product !== oldproduct) {
      newproduct = product;
    } else newproduct = oldproduct;

    if (signature_id && signature_id !== oldsignatureId) {
      newsignatureId = signature_id;
    } else newsignatureId = oldsignatureId;

    const deliveryguyExists = await DeliveryGuy.findOne({
      where: { id: newdeliverymanId },
    });
    if (!deliveryguyExists) {
      return res
        .status(400)
        .json({ error: 'This Delivery Guy does not exist' });
    }

    const recipientExists = await Recipient.findOne({
      where: { id: newrecipientId },
    });
    if (!recipientExists) {
      return res.status(400).json({ error: 'This Recipient does not exist' });
    }

    const signatureExists = await File.findOne({
      where: { id: newsignatureId },
    });
    if (!signatureExists) {
      return res
        .status(400)
        .json({ error: 'This Signature File does not exist' });
    }

    await order.update({
      recipient_id: newrecipientId,
      deliveryman_id: newdeliverymanId,
      product: newproduct,
      signature_id: newsignatureId,
      start_date,
      end_date,
      canceled_at,
    });

    // const { name, email } = await DeliveryGuy.findOne({
    //   where: { id: newdeliverymanId },
    // });

    await Mail.sendMail({
      to: `${deliveryguyExists.name} <${deliveryguyExists.email}>`,
      subject: 'You`ve got a Updated Order',
      template: 'updatedOrder',
      context: {
        deliveryguy: deliveryguyExists.name,
        product: newproduct,
        recipient: recipientExists.name,
      },
    });

    return res.json(order);
  }
}

export default new OrderController();
