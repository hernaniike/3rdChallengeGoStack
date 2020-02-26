import DeliveryProblem from '../models/DeliveryProblem';
import DeliveryGuy from '../models/Deliveryguy';
import Recipient from '../models/Recipient';
import Order from '../models/Order';
import Mail from '../../lib/Mail';

class DeliveryProblemsController {
  async store(req, res) {
    const delivery_id = req.params.id;
    const delIdExist = await Order.findByPk(delivery_id);

    if (!delIdExist) {
      return res.status(400).json({ error: 'This order does not exist' });
    }

    if (delIdExist.canceled_at !== null) {
      return res
        .status(400)
        .json({ error: 'You cannot create new problems for canceled orders.' });
    }

    const { description } = req.body;
    await DeliveryProblem.create({
      delivery_id,
      description,
    });
    return res.json({ delivery_id, description });
  }

  async index(req, res) {
    const problems = await DeliveryProblem.findAll();
    if (problems == '') {
      return res.status(400).json({ error: 'There`s no problems yet.' });
    }

    return res.json(problems);
  }

  // continuar daqui
  async orderproblem(req, res) {
    const orderId = req.params.id;
    const orderExist = await Order.findByPk(orderId);
    if (!orderExist) {
      return res
        .status(400)
        .json({ error: 'Order id provided does not exist.' });
    }
    const orderProblems = await DeliveryProblem.findAll({
      where: { delivery_id: orderId },
    });

    if (orderProblems == '') {
      return res
        .status(400)
        .json({ error: 'There`s no problems for this order yet.' });
    }
    return res.json(orderProblems);
  }

  async delete(req, res) {
    const { problemId } = req.params;
    const problemExist = await DeliveryProblem.findByPk(problemId);
    if (problemExist == null) {
      return res.status(400).json({ error: 'Problem Id does not exist' });
    }
    // const { delivery_id: orderID } = await DeliveryProblem.findByPk(problemId);
    const canceledOrder = await Order.findByPk(problemExist.delivery_id);
    if (canceledOrder.canceled_at !== null) {
      return res
        .status(400)
        .json({ error: 'This order is canceled, you cannot cancel again.' });
    }

    await canceledOrder.update({ canceled_at: new Date() });
    const deliveryguy = await DeliveryGuy.findByPk(
      canceledOrder.deliveryman_id
    );
    const recipient = await Recipient.findByPk(canceledOrder.recipient_id);

    await Mail.sendMail({
      to: `${deliveryguy.name} <${deliveryguy.email}>`,
      subject: 'You`ve got a Canceled Order',
      template: 'canceledOrder',
      context: {
        deliveryguy: deliveryguy.name,
        product: canceledOrder.product,
        recipient: recipient.name,
        canceled_date: canceledOrder.canceled_at,
      },
    });

    return res.json(canceledOrder);
  }
}

export default new DeliveryProblemsController();
