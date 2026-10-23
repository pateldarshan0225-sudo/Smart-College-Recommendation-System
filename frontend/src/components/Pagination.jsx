export default function Pagination({
  data,
  onPage
}) {
  if (!data || data.pages < 2) return null;
  return <nav className="pagination" aria-label="Pagination">
  <button className="button secondary" disabled={data.page <= 1} onClick={() => onPage(data.page - 1)}>Previous</button>
  <span>Page {data.page} of {data.pages} · {data.total} results</span>
  <button className="button secondary" disabled={data.page >= data.pages} onClick={() => onPage(data.page + 1)}>Next</button>
</nav>;
}
