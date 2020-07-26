export class SVG_File_Manager {
  constructor( event_handler, file_list) {
    this.svgns = `http://www.w3.org/2000/svg`;
    this.event_handler = event_handler;
    this.file_list = file_list;

    console.log(this.file_list);

    this.init()
  }

  init () {
    console.log("SVG_File_Manager");

    this.list_files(this.file_list);

    // loading local files
    // document.getElementById(`svg_upload`).addEventListener(`change`, this.load_local_file, false);
    document.getElementById(`svg_upload`).addEventListener(`change`, this.load_local_file.bind(this), false);

    // loading server files
    document.getElementById(`server_file_select`).addEventListener(`change`, this.load_server_file.bind(this), false);

    // save files locally
    document.getElementById(`save_file_button`).addEventListener(`click`, this.save_file.bind(this), false);

    // fullscreen
    document.getElementById(`fullscreen_button`).addEventListener(`click`, this.display_svg_fullscreen.bind(this), false);

    console.log("init");
  }

  list_files (index_file) {
    fetch(index_file)
      .then( response =>  response.text() )
      .then((str) => {
        let html = null;
        try {
          html = (new window.DOMParser()).parseFromString(str, "text/html");
        } catch(err) {
          console.log(err.message);
        }
        return html;
      })
      .then((data) => {
        // console.log(data)
        const server_file_select = document.getElementById(`server_file_select`);

        const links = Array.from(data.querySelectorAll(`a`));
        links.shift(); // remove first item from list
        for (let item of links) {
          // only get filename, not full path
          // TODO: might need to change this to allow nested directories
          let url = item.href.split(`/`).pop(); 

          let option = document.createElement(`option`);
          option.setAttribute(`value`, url);
          option.textContent = item.textContent;
          server_file_select.appendChild(option);
        }
      })
  }

  /* Uploads SVG files from local file system, based on file selected in input */
  load_local_file (event) {
    let file = event.target.files[0]; // FileList object
    if (file) {
      const file_reader = new FileReader();
      if (`image/svg+xml` == file.type) {
        file_reader.readAsText(file);
        file_reader.addEventListener(`load`, function () {
          var file_content = file_reader.result;
          this.insert_svg(file_content);
        }.bind(this), false);
      }
    }
  }


  /* Inserts SVG files into HTML document */
  insert_svg (file_content) {
    // insert SVG file into HTML page
    const svg_container = document.getElementById("svg_container");
    svg_container.innerHTML = file_content;

    // TODO: insert any SVG handler here
    // adds `click` event listener to inserted SVG to test modification of SVG file, for later saving
    if (this.event_handler) {
      svg_container.firstChild.addEventListener("click", this.event_handler, false)
    }
  }

  /* Retrieves SVG files from server, based on filename selected in dropdown */
  async load_server_file(event) {
    const select_el = event.target;
    const filename = select_el.value; 
    if (filename !== `none`) {
      let path = `./assets/`;

      // uses modern asynchronous promise-based `fetch` rather than `XMLHttpRequest`
      await fetch(`${path}${filename}`)
        .then( response =>  response.text() )
        .then(svg_str => {
            this.insert_svg (svg_str);
          })
          .catch(err => {
            throw new Error(err);
          });
    }
  }


  /* Serializes and saves SVG file to local file system */
  save_file () {
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
  display_svg_fullscreen () {
    const svg_el = document.querySelector("#svg_container > svg");
    if (svg_el.requestFullscreen) {
      svg_el.requestFullscreen();
    }
  }
}
