/* Adds a stroke to any SVG element that's been clicked on */
function add_stroke(event) {
  const target_el = event.target;
  target_el.setAttribute("stroke", "gray");
  target_el.setAttribute("stroke-width", "3");

  // announce status
  const status = document.getElementById("status");
  status.textContent = "box clicked";
}

