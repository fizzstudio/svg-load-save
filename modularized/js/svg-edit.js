export function add_stroke(event) {
  /* Adds a stroke to any SVG element that's been clicked on */
  const target_el = event.target;
  target_el.setAttribute("stroke", "gray");
  target_el.setAttribute("stroke-width", "3");

  // announce status
  const status = document.getElementById("status");
  const span = document.createElement("span");
  // status.textContent = "";
  // status.textContent = "box clicked";
  span.textContent = "box clicked";
  status.replaceChild(span, status.firstChild);
}

