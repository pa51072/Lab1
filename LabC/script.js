
var map = L.map("map").setView([53, 14], 18);
var puzzlePieces = [];

L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
        attribution: "Tiles &copy; Esri",
    }
).addTo(map);

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event) {
    event.preventDefault();
}

function dragStart(event) {
    var dragImage = event.target.cloneNode(true);
    dragImage.id = "dragImage";
    dragImage.style.position = "absolute";
    dragImage.style.zIndex = "1000";
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    event.dataTransfer.setData("text", event.target.id);
}

function dragStartBlock(event) {
    var dragImage = event.target.cloneNode(true);
    dragImage.id = "dragImage";
    dragImage.style.position = "absolute";
    dragImage.style.zIndex = "1000";
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    event.dataTransfer.setData("text", event.target.id);
}

function dragEnd(event) {
    var dragImage = document.getElementById("dragImage");
    if (dragImage) {
        dragImage.parentNode.removeChild(dragImage);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

var blocks = document.querySelectorAll(".block");
blocks.forEach(function (block) {
    block.addEventListener("dragstart", dragStartBlock);
});

function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    var piece = document.getElementById(data);

    if (event.target.classList.contains("block")) {
        var block = event.target;

        var hasChild = block.hasChildNodes();

        if (piece.firstChild instanceof HTMLCanvasElement) {
            
            if (hasChild && piece.parentNode !== block) {
                var tempBackground = block.style.backgroundImage;
                block.style.backgroundImage = piece.style.backgroundImage;
                piece.style.backgroundImage = tempBackground;
            }

            
            block.style.backgroundImage = `url(${piece.firstChild.toDataURL()})`;

            
            if (hasChild) {
                var secondChild = document.createElement("div");
                secondChild.style.width = "100%";
                secondChild.style.height = "100%";
                secondChild.style.position = "absolute";
                secondChild.style.backgroundImage = `url(${piece.firstChild.toDataURL()})`;
                block.appendChild(secondChild);
            }

            
            if (!hasChild) {
                block.appendChild(piece);
                piece.style.display = "none";

                var puzzleContainer = document.getElementById("puzzleContainer");

                if (piece.parentNode === puzzleContainer) {
                    puzzleContainer.removeChild(piece);
                }
            }
        } else {
            console.error("Invalid puzzle piece dropped");
        }

        var boardSquares = document.querySelectorAll(".block");
        var puzzlePiecesInBoard = document.querySelectorAll(".block div");

        if (boardSquares.length === puzzlePiecesInBoard.length) {
            var isSolved = true;
            for (var i = 0; i < boardSquares.length; i++) {
                if (boardSquares[i].firstChild !== puzzlePiecesInBoard[i]) {
                    isSolved = false;
                    break;
                }
            }
            console.log("Ułożone poprawnie")
            if (isSolved) {
                alert("Ułożone poprawnie!");
            }
        }
    }
}

document
    .getElementById("getLocation")
    .addEventListener("click", function () {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                var coords =
                    "Szerokość: " +
                    lat.toFixed(6) +
                    "<br>Długość: " +
                    lon.toFixed(6);
                map.setView([lat, lon], 18);
            });
        } else {
            alert("Geolokacja niedostępna.");
        }
    });

document
    .getElementById("saveButton")
    .addEventListener("click", function () {
        var puzzleContainer = document.getElementById("puzzleContainer");
        puzzleContainer.innerHTML = "";
        puzzlePieces = [];

        const board = document.getElementById("board");

        board.innerHTML = "";

        for (let i = 1; i <= 16; i++) {
            const block = document.createElement("div");
            block.classList.add("block");
            block.setAttribute("draggable", "true");
            block.ondragstart = function (event) {
                drag(event);
            };
            block.addEventListener("dragover", dragOver);
            block.addEventListener("drop", drop);
            block.addEventListener("dragleave", allowDrop);

            block.id = "block" + i;
            board.appendChild(block);
        }

        map.invalidateSize();
        leafletImage(map, function (err, canvas) {
            if (err) {
                console.error(err);
                return;
            }

            var RasterImage = document.getElementById(
                "RasterImage"
            );
            RasterImage.src = canvas.toDataURL("image/png");
            RasterImage.style.display = "none";

            var pieceWidth = canvas.width / 4;
            var pieceHeight = canvas.height / 4;

            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    var puzzlePiece = document.createElement("div");
                    puzzlePiece.className = "puzzle-piece";
                    puzzlePiece.setAttribute("draggable", "true");
                    puzzlePiece.ondragstart = function (event) {
                        drag(event);
                    };
                    puzzlePiece.style.width = pieceWidth + "px";
                    puzzlePiece.style.height = pieceHeight + "px";
                    puzzlePiece.id = "puzzlePiece" + (row * 4 + col + 1);

                    var pieceCanvas = document.createElement("canvas");
                    pieceCanvas.width = pieceWidth;

                    var block = document.getElementsByClassName("block");

                    for (var i = 0; i < block.length; i++) {
                        block[i].style.width = pieceWidth + "px";
                        block[i].style.height = pieceHeight + "px";
                    }
                    pieceCanvas.height = pieceHeight;
                    var ctx = pieceCanvas.getContext("2d");
                    ctx.drawImage(
                        canvas,
                        -col * pieceWidth,
                        -row * pieceHeight,
                        canvas.width,
                        canvas.height
                    );
                    puzzlePiece.appendChild(pieceCanvas);
                    puzzlePieces.push(puzzlePiece);
                    puzzleContainer.appendChild(puzzlePiece);
                }
            }

            puzzlePieces.sort(function () {
                return 0.5 - Math.random();
            });

            for (var i = 0; i < puzzlePieces.length; i++) {
                puzzlePieces[i].addEventListener("dragend", dragEnd);
                puzzleContainer.appendChild(puzzlePieces[i]);
            }
        });
    });
