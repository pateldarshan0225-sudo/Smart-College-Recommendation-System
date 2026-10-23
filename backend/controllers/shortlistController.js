import Shortlist from '../models/Shortlist.js';
import College from '../models/College.js';
import { ok, fail, id, reference } from '../utils/validation.js';
import { paginate } from '../utils/pagination.js';
import { ACTIVE } from '../utils/activeRecords.js';
export async function list(req, res) {
  const colleges = await College.distinct('_id', ACTIVE);
  ok(res, await paginate(Shortlist, {
    collegeId: { $in: colleges },
    userId: req.session.identity.id
  }, req.query, ['collegeId']));
}
export async function create(req, res) {
  const collegeId = id(req.body.collegeId, 'College');
  await reference(College, collegeId, 'Active college', ACTIVE);
  ok(res, await Shortlist.create({
    userId: req.session.identity.id,
    collegeId
  }), 'Shortlisted', 201);
}
export async function update(req, res) {
  const collegeId = id(req.body.collegeId, 'College');
  await reference(College, collegeId, 'Active college', ACTIVE);
  const record = await Shortlist.findOneAndUpdate({
    _id: req.params.id,
    userId: req.session.identity.id
  }, {
    collegeId
  }, {
    new: true,
    runValidators: true
  });
  if (!record) fail('Shortlist not found', 404);
  ok(res, record, 'Selection changed');
}
export async function remove(req, res) {
  const record = await Shortlist.findOneAndDelete({
    _id: req.params.id,
    userId: req.session.identity.id
  });
  if (!record) fail('Shortlist not found', 404);
  ok(res, null, 'Removed');
}
