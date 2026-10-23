import Feedback from '../models/Feedback.js';
import { ok, fail, text, number } from '../utils/validation.js';
import { paginate } from '../utils/pagination.js';
const scope = req => req.session.identity.role === 'admin' ? {} : {
  userId: req.session.identity.id
};
function data(body) {
  const rating = number(body.rating, 'Rating', 1, 5);
  if (!Number.isInteger(rating)) fail('Rating must be a whole number');
  return {
    message: text(body.message, 'Message'),
    rating
  };
}
export async function list(req, res) {
  ok(res, await paginate(Feedback, scope(req), req.query, [{
    path: 'userId',
    select: 'name email'
  }]));
}
export async function create(req, res) {
  ok(res, await Feedback.create({
    ...data(req.body),
    userId: req.session.identity.id
  }), 'Feedback sent', 201);
}
export async function update(req, res) {
  const record = await Feedback.findOneAndUpdate({
    _id: req.params.id,
    ...scope(req)
  }, data(req.body), {
    new: true,
    runValidators: true
  });
  if (!record) fail('Feedback not found', 404);
  ok(res, record, 'Feedback updated');
}
export async function remove(req, res) {
  const record = await Feedback.findOneAndDelete({
    _id: req.params.id,
    ...scope(req)
  });
  if (!record) fail('Feedback not found', 404);
  ok(res, null, 'Feedback deleted');
}
