function posleCitanja(displej, response, data) {
  if (!response.ok) {
    displej.textContent = "Err";
    return;
  }
  displej.textContent = String(data.temperatura);
}
