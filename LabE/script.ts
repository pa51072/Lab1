// const msg: string = "Hello!";
// alert(msg);

const styles = [
  { name: "zielony", path: "css/zielony.css" },
  { name: "czerwony", path: "css/czerwony.css" },
  {name: "resp", path: "css/resp.css"}
];

document.addEventListener("DOMContentLoaded", () => {
  const styleDiv = document.getElementById("style-div");

  function changeStylesheet(styleSheetPath: string) {
    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.type = "text/css";
    styleLink.href = styleSheetPath;
    styleLink.id = "dynamic-styles";

    const existingLink = document.getElementById("dynamic-styles");
    if (existingLink) {
      document.head.removeChild(existingLink);
    }

    document.head.appendChild(styleLink);
  }

  const defaultStylePath = styles[0].path;
  changeStylesheet(defaultStylePath);

  styles.forEach((style) => {
    const link = document.createElement("a");
    link.href = "#";
    link.innerText = style.name;

    link.addEventListener("click", (event) => {
      event.preventDefault();
      changeStylesheet(style.path);
    });

    if (styleDiv) {
      styleDiv.appendChild(link);
    } else {
      console.error("Element with ID 'style-div' not found.");
    }
  });
});