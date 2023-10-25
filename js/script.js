const imagem = document.querySelector("#imagem-inicial");
const menuMobile = document.querySelector(".navbar-mobile-expand");

function openMenu() {
  if (menuMobile.style.display === "none") {
    menuMobile.style.display = "flex";
  } else {
    menuMobile.style.display = "none";
  }
}

$(document).ready(function () {
  $("#busca").on("keyup", function () {
    buscarDados($("#tipo").val(), $(this).val());
  });
  $("#tipo").change(function () {
    buscarDados($(this).val(), $("#busca").val());
  });
});


function buscarDados(filtro, pesquisa) {
  fetch("../js/data.json")
    .then((response) => response.json())
    .then((data) => {
      var jsonData = data;
      if (filtro != 0) {
        jsonData = jsonData.filter((item) => item.tipo == filtro);
      }
      if (pesquisa != "") {
        jsonData = jsonData.filter((item) =>
          [
            item.nome,
            item.endereco,
            item.bairro,
            item.cidade,
            item.estado,
            ...item.contato.map((contato) => contato.valor),
          ].some((field) =>
            field.toLowerCase().includes(pesquisa.toLowerCase())
          )
        );
      }

      var showData = document.querySelector(".show-data");
      showData.innerHTML = "";

      if (jsonData.length === 0) {
        var errorMessage = document.createElement("p");
        imagem.style.display = "none";
        errorMessage.textContent = "Nenhum resultado encontrado.";
        showData.appendChild(errorMessage);
        errorMessage.style.margin = "0 auto";
        errorMessage.style.fontWeight = "bold";
        return;
      }

      jsonData.forEach((item) => {
        var col = document.createElement("div");
        col.className = "col-6 mt-2";

        var card = document.createElement("div");
        card.className = "card text-center";

        var cardBody = document.createElement("div");
        cardBody.className = "card-body";

        var cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        cardTitle.textContent = item.nome;

        var cardText = document.createElement("p");
        cardText.className = "card-text";
        var endereco =
          item.endereco +
          ", " +
          item.numero +
          "<br>" +
          item.cidade +
          "/" +
          item.estado +
          " - " +
          item.bairro;
        var contatos = "";
        item.contato.forEach((contato) => {
          contatos += "Contato: " + contato.valor + "<br>";
        });
        cardText.innerHTML = contatos + endereco;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(cardBody);
        col.appendChild(card);
        showData.appendChild(col);
      });
    })
    .catch((error) => console.error("Erro ao buscar o JSON:", error));
}
