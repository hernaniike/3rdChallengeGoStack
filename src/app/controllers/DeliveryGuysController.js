import * as Yup from 'yup';
import DeliveryGuys from '../models/Deliveryguy';
import File from '../models/File';

class DeliveryGuysController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const deliveryguyExist = await DeliveryGuys.findOne({
      where: { email: req.body.email },
    });

    if (deliveryguyExist) {
      return res
        .status(400)
        .json({ error: 'This email is already in use, Choose another one!' });
    }
    const { name, email, avatar_id } = req.body;

    const deliveryguy = await DeliveryGuys.create({
      name,
      email,
      avatar_id,
    });
    return res.json(deliveryguy);
  }

  async index(req, res) {
    const deliverys = await DeliveryGuys.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url', 'name', 'path'],
        },
      ],
    });
    return res.json(deliverys);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails!' });
    }

    const { id, email } = req.body;
    const deliveryguy = await DeliveryGuys.findOne({ where: id });

    if (!deliveryguy) {
      return res.status(400).json({ error: 'This user does not exist' });
    }

    if (email) {
      const deliveryguyemailExists = await DeliveryGuys.findOne({
        where: { email },
      });
      if (deliveryguyemailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }
    await deliveryguy.update(req.body);
    return res.json(deliveryguy);
  }

  async delete(req, res) {
    const deliveryguy = await DeliveryGuys.findByPk(req.params.id, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    if (!deliveryguy) {
      return res.status(400).json({ error: 'User not Found!' });
    }

    await DeliveryGuys.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json(deliveryguy);
  }
}

export default new DeliveryGuysController();
