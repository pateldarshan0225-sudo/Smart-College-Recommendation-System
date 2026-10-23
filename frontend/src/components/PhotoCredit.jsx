export default function PhotoCredit({ college }) {
  if (!college.imageSource) return null;
  return <small className="photo-credit">
    Photo: <a href={college.imageSource} target="_blank" rel="noreferrer">{college.imageCredit || 'Wikimedia Commons'}</a>
    {' · '}{college.imageLicenseUrl ? <a href={college.imageLicenseUrl} target="_blank" rel="noreferrer">{college.imageLicense}</a> : college.imageLicense}
    {' · Resized; cropped to fit.'}
  </small>;
}
