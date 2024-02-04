import { responseErrorMessage } from '@/errors/response-error';
import { STATUS_MESSAGE_ENUM } from '@/lib/enum';
import FileManager from '@/models/file';
const fileManager = new FileManager();
export default function handler(req, res) {
  switch (req.method) {
    case "GET": getAllFile(req, res); break;      
  }
}
async function getAllFile(req, res) {
  try {
    const query = req.query;
    const path = query?.path ? String(query?.path) : "/";
    const data = await fileManager.getAll(path);
    res.status(STATUS_MESSAGE_ENUM.Ok).json({ data })
  } catch (e) {
    responseErrorMessage(e, res);
  }
} 