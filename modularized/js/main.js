import { SVG_File_Manager } from "./SVG_File_Manager.js";
import { add_stroke } from "./svg-edit.js";


window.onload = function() {
  console.log("main");
  const file_manager = new SVG_File_Manager( add_stroke, `./assets/index.html` );
}
