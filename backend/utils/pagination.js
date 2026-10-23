import { number } from './validation.js';
export function pagination(query) {
  const page = number(query.page ?? 1, 'Page', 1, 100000);
  const limit = number(query.limit ?? 12, 'Limit', 1, 100);
  if (!Number.isInteger(page) || !Number.isInteger(limit)) {
    const e = new Error('Page and limit must be integers');
    e.status = 400;
    throw e;
  }
  return {
    page,
    limit,
    skip: (page - 1) * limit
  };
}
export async function paginate(Model, filter, query, populate = [], sort = {
  _id: -1
}) {
  const {
    page,
    limit,
    skip
  } = pagination(query);
  const [items, total] = await Promise.all([Model.find(filter).sort(sort).skip(skip).limit(limit).populate(populate), Model.countDocuments(filter)]);
  return {
    items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}
