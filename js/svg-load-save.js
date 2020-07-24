window.onload = function() {
  // loading local files
  document.getElementById(`svg_upload`).addEventListener(`change`, load_local_file, false);

  // loading server files
  document.getElementById(`server_file_select`).addEventListener(`change`, load_server_file, false);

  // save files locally
  document.getElementById(`save_file_button`).addEventListener(`click`, save_file, false);

  // fullscreen
  document.getElementById(`fullscreen_button`).addEventListener(`click`, go_fullscreen, false);
}

/* Uploads SVG files from local file system, based on file selected in input */
function load_local_file (event) {
  let file = event.target.files[0]; // FileList object

  if (file) {
    file_reader = new FileReader();

    if ("image/svg+xml" == file.type) {
      file_reader.readAsText(file);
      file_reader.addEventListener("load", function () {
        var file_content = file_reader.result;
        insert_svg(file_content);
      }, false);
    }
  }
}

/* Retrieves SVG files from server, based on filename selected in dropdown */
async function load_server_file(event) {
  const select_el = event.target;
  const filename = select_el.value; 
  if (filename !== `none`) {
    let path = `./assets/`;

    // uses modern asynchronous promise-based `fetch` rather than `XMLHttpRequest`
    await fetch(`${path}${filename}`)
    .then( response =>  response.text() )
    .then(svg_str => {
        insert_svg (svg_str);
      })
      .catch(err => {
        throw new Error(err);
      });
  }
}


/* Inserts SVG files into HTML document */
function insert_svg (file_content) {
  // insert SVG file into HTML page
  const svg_container = document.getElementById("svg_container");
  svg_container.innerHTML = file_content;

  // TEMP: adds `click` event listener to inserted SVG to test modification of SVG file, for later saving
  if (add_stroke) {
    svg_container.firstChild.addEventListener("click", add_stroke, false)
  }
}


/* Serializes and saves SVG file to local file system */
function save_file () {
  const svg_el = document.querySelector("#svg_container > svg");
  if (svg_el) {
    let content = new XMLSerializer().serializeToString( svg_el );
    let filetype = `image/svg+xml`;

    let name = "modified_svg";
    let filename = `${name}.svg`;

    let DOMURL = self.URL || self.webkitURL || self;
    let blob = new Blob([content], {type : 'image/svg+xml;charset=utf-8'});
    let url = DOMURL.createObjectURL(blob);

    let file_save_section = document.querySelector(`#controls`);
    let download_link_el = document.createElement(`a`);
    download_link_el.style = `display: none`;
    file_save_section.appendChild(download_link_el);
    download_link_el.download = filename;

    if ( `image/svg+xml` == filetype ) {
      download_link_el.href = url;
    }

    download_link_el.click();
    DOMURL.revokeObjectURL(url);
    download_link_el.remove();
  }
}


/* Makes embedded SVG element go fullscreen, apart from host parent HTML file */
function go_fullscreen () {
  const svg_el = document.querySelector("#svg_container > svg");
  if (svg_el.requestFullscreen) {
    svg_el.requestFullscreen();
  }
}


