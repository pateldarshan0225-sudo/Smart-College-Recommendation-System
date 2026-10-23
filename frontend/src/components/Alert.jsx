export default function Alert({
  message,
  type = "error"
}) {
  return message ? <div className={`alert ${type}`} role={type === "error" ? "alert" : "status"}>
  {message}
</div> : null;
}
