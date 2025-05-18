import dbConnect from '../../utils/dbConnect';
import Settings from '../../models/Settings';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        let settings = await Settings.findOne();
        if (!settings) {
          settings = await Settings.create({ calendlyLink: '' });
        }
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case 'PUT':
      try {
        const settings = await Settings.findOneAndUpdate({}, req.body, {
          new: true,
          upsert: true,
          runValidators: true,
        });
        res.status(200).json({ success: true, data: settings });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
} 