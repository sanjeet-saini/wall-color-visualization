let selectedColor = null;
let history = [];

const childPalette = document.getElementById("childPalette");
const wallParts = document.querySelectorAll(".wall-child");

const roomImages = {
  living: {
    left: "images/colour-guid_living-room_1-2-1.png",
    right: "images/colour-guid_living-room_2-2.png",
  },
  bedroom: {
    left: "images/colour-guid_2.png",
    right: "images/colour-guid_1.png",
  },
  kitchen: {
    left: "images/colour-guid_kitchen_2.png",
    right: "images/colour-guid_kitchen_1.png",
  },
  kidroom: {
    left: "images/colour-guid_kids_room.png",
    right: "images/colour-guid_kids_room_2.png",
  },
};

async function getColors() {
  const res = await fetch("colors.json");
  const data = await res.json();
  return data.common;
}

function hexToRgb(hex) {
  const cleanHex = hex.replace("#", "");
  return {
    r: parseInt(cleanHex.slice(0, 2), 16),
    g: parseInt(cleanHex.slice(2, 4), 16),
    b: parseInt(cleanHex.slice(4, 6), 16),
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
}

function mixColor(hex, targetHex, amount) {
  const color = hexToRgb(hex);
  const target = hexToRgb(targetHex);

  return rgbToHex(
    Math.round(color.r + (target.r - color.r) * amount),
    Math.round(color.g + (target.g - color.g) * amount),
    Math.round(color.b + (target.b - color.b) * amount)
  );
}

function createShades(colors) {
  return colors.flatMap((color) => [
    { code: mixColor(color.code, "#FFFFFF", 0.55), name: `Light ${color.name}` },
    { code: mixColor(color.code, "#FFFFFF", 0.25), name: `Soft ${color.name}` },
    { code: color.code, name: `Medium ${color.name}` },
    { code: mixColor(color.code, "#000000", 0.28), name: `Deep ${color.name}` },
    { code: mixColor(color.code, "#000000", 0.48), name: `Dark ${color.name}` },
  ]);
}

function getWallState() {
  const colorButtons = Array.from(document.querySelectorAll(".child-color"));

  return {
    left: wallParts[0].style.backgroundColor,
    right: wallParts[1].style.backgroundColor,
    selectedColor,
    activeColorIndex: colorButtons.findIndex((button) =>
      button.classList.contains("active")
    ),
  };
}

function applyWallState(state) {
  wallParts[0].style.backgroundColor = state.left;
  wallParts[1].style.backgroundColor = state.right;
  selectedColor = state.selectedColor;

  document.querySelectorAll(".child-color").forEach((button, index) => {
    button.classList.toggle("active", index === state.activeColorIndex);
  });
}

function saveHistory() {
  history.push(getWallState());
}

function resetWalls() {
  wallParts.forEach((wall) => {
    wall.style.backgroundColor = "transparent";
  });
}

function clearSelectedColor() {
  selectedColor = null;

  document
    .querySelectorAll(".child-color")
    .forEach((button) => button.classList.remove("active"));
}

function setRoomImages(room) {
  document.getElementById("leftWall").src = roomImages[room].left;
  document.getElementById("rightWall").src = roomImages[room].right;
}

async function loadChildPalette() {
  childPalette.innerHTML = "";
  const colors = createShades(await getColors());

  colors.forEach((color) => {
    const div = document.createElement("div");
    div.className = "child-color";
    div.style.backgroundColor = color.code;
    div.title = `${color.name} (${color.code})`;

    div.onclick = () => {
      document
        .querySelectorAll(".child-color")
        .forEach((c) => c.classList.remove("active"));

      div.classList.add("active");
      selectedColor = color.code;
    };

    childPalette.appendChild(div);
  });
}

wallParts.forEach((wall) => {
  wall.onclick = () => {
    if (!selectedColor) {
      alert("Select color first");
      return;
    }

    saveHistory();
    wall.style.backgroundColor = selectedColor;
  };
});

document.querySelectorAll(".parent").forEach((parent) => {
  parent.onclick = () => {
    document
      .querySelectorAll(".parent")
      .forEach((p) => p.classList.remove("active"));

    parent.classList.add("active");
    setRoomImages(parent.id);
    history = [];
    resetWalls();
    clearSelectedColor();
    loadChildPalette();
  };
});

document.getElementById("undoBtn").onclick = () => {
  const last = history.pop();
  if (!last) return;

  applyWallState(last);
};

document.getElementById("resetBtn").onclick = () => {
  saveHistory();
  resetWalls();
  clearSelectedColor();
};

setRoomImages("living");
loadChildPalette();
