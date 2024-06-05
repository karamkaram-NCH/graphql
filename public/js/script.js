const apiUrl = "http://localhost:3001/api/";
let quotes = [];

const DOM = {
  bulk: {
    div: document.getElementById("bulk-div"),
    insertAllButton: document.getElementById("bulk-insert-all"),
    deleteAllButton: document.getElementById("bulk-delete-all"),
  },
  create: {
    quoteInput: document.getElementById("create-quote"),
    authorInput: document.getElementById("create-author"),
    createButton: document.getElementById("create-button"),
    createQuoteAction: async () => {
      const quote = DOM.create.quoteInput.value;
      const author = DOM.create.authorInput.value;
      const response = await APIS.graphql.createQuote(quote, author);
      if (response) {
        DOM.create.clearInputs();
        DOM.toast.showToast("Quote Created Successfully!");
        APIS.graphql.fetchQuotes();
      }
    },
    clearInputs: () => {
      DOM.create.quoteInput.value = "";
      DOM.create.authorInput.value = "";
    },
  },
  update: {
    div: document.getElementById("update-div"),
    idInput: document.getElementById("update-id"),
    quoteInput: document.getElementById("update-quote"),
    authorInput: document.getElementById("update-author"),
    updateButton: document.getElementById("update-button"),
    cancelButton: document.getElementById("update-cancel-button"),
    ClearInputs: () => {
      DOM.update.div.style.display = "none";
      DOM.update.idInput.value = "";
      DOM.update.quoteInput.value = "";
      DOM.update.authorInput.value = "";
    },
    updateAction: async () => {
      const id = DOM.update.idInput.value;
      const quote = DOM.update.quoteInput.value;
      const author = DOM.update.authorInput.value;
      const response = await APIS.graphql.updateQuote(id, quote, author);
      if (response) {
        DOM.update.ClearInputs();
        DOM.toast.showToast("Quote Updated Successfully!");
        APIS.graphql.fetchQuotes();
      }
    },
    clearInputs: () => {
      DOM.update.div.style.display = "none";
      DOM.update.idInput.value = "";
      DOM.update.quoteInput.value = "";
      DOM.update.authorInput.value = "";
    },
  },
  toast: {
    toast: document.getElementById("toast-container"),
    showToast: (message, state, duration) => {
      const toast = document.createElement("div");
      toast.className = `toast ${
        !state || state === "success" ? "t-green" : "t-red"
      }`;
      toast.innerText = message;
      DOM.toast.toast.appendChild(toast);
      toast.style.display = "block";

      setTimeout(() => {
        toast.style.display = "none";
        DOM.toast.toast.removeChild(toast);
      }, duration || 1000);
    },
  },
  initialize: () => {
    DOM.bulk.insertAllButton.addEventListener(
      "click",
      APIS.api.insertAllQuotes
    );
    DOM.bulk.deleteAllButton.addEventListener(
      "click",
      APIS.api.deleteAllQuotes
    );
    DOM.create.createButton.addEventListener(
      "click",
      DOM.create.createQuoteAction
    );
    DOM.update.updateButton.addEventListener("click", DOM.update.updateAction);
    DOM.update.cancelButton.addEventListener("click", DOM.update.clearInputs);
  },
};

const TABLE = {
  data: {
    currentPage: 1,
    quotesPerPage: 10,
  },
  dom: {
    tBody: document.getElementById("quote-table-body"),
    first: document.getElementById("quote-table-first"),
    previous: document.getElementById("quote-table-previous"),
    pageInfo: document.getElementById("quote-table-page-info"),
    next: document.getElementById("quote-table-next"),
    last: document.getElementById("quote-table-last"),
  },
  actions: {
    update: (id) => {
      const quote = quotes.find((q) => q._id === id);
      if (quote) {
        DOM.update.div.style.display = "block";
        DOM.update.idInput.value = quote._id;
        DOM.update.quoteInput.value = quote.quote;
        DOM.update.authorInput.value = quote.author;
      }
    },
    delete: async (id) => {
      if (id === DOM.update.idInput.value) {
        DOM.update.ClearInputs();
      }
      const response = APIS.graphql.deleteQuote(id);
      if (response) {
        DOM.toast.showToast("Quote Deleted Successfully!");
        APIS.graphql.fetchQuotes();
      }
    },
    goToFirstPage: () => {
      TABLE.data.currentPage = 1;
      TABLE.actions.displayQuotes();
    },
    goToPreviousPage: () => {
      if (TABLE.data.currentPage > 1) {
        TABLE.data.currentPage--;
        TABLE.actions.displayQuotes();
      }
    },
    goToNextPage: () => {
      if (
        TABLE.data.currentPage <
        Math.ceil(quotes.length / TABLE.data.quotesPerPage)
      ) {
        TABLE.data.currentPage++;
        TABLE.actions.displayQuotes();
      }
    },
    goToLastPage: () => {
      TABLE.data.currentPage = Math.ceil(
        quotes.length / TABLE.data.quotesPerPage
      );
      TABLE.actions.displayQuotes();
    },
    displayQuotes: () => {
      if (!TABLE.data.currentPage) {
        TABLE.data.currentPage = 1;
      }
      if (
        TABLE.data.currentPage >
        Math.ceil(quotes.length / TABLE.data.quotesPerPage)
      ) {
        TABLE.data.currentPage--;
      }
      const startIndex =
        (TABLE.data.currentPage - 1) * TABLE.data.quotesPerPage;
      const endIndex = startIndex + TABLE.data.quotesPerPage;
      const quotesToDisplay = quotes.slice(startIndex, endIndex);

      TABLE.dom.tBody.innerHTML = "";
      quotesToDisplay.forEach((quote) => {
        const row = `<tr>
                      <td>${quote.quote}</td>
                      <td>${quote.author}</td>
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <button class="btn btn-outline-primary" onclick="TABLE.actions.update('${quote._id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                            </svg>
                          </button>
                          <button class="btn btn-outline-danger" onclick="TABLE.actions.delete('${quote._id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>`;
        TABLE.dom.tBody.insertAdjacentHTML("beforeend", row);
      });

      const texContent = `Page ${TABLE.data.currentPage} of ${Math.ceil(
        quotes.length / TABLE.data.quotesPerPage
      )}`;
      TABLE.dom.pageInfo.textContent = texContent;
    },
  },
  initialize: () => {
    TABLE.dom.first.addEventListener("click", TABLE.actions.goToFirstPage);
    TABLE.dom.previous.addEventListener(
      "click",
      TABLE.actions.goToPreviousPage
    );
    TABLE.dom.next.addEventListener("click", TABLE.actions.goToNextPage);
    TABLE.dom.last.addEventListener("click", TABLE.actions.goToLastPage);
  },
};

const APIS = {
  endpoints: {
    graphql: apiUrl + "graphql",
    insertAllQuotes: apiUrl + "quotes",
    deleteAllQuotes: apiUrl + "quotes/delete",
  },
  graphql: {
    fetchQuotes: async () => {
      const query = `
              query {
                quotes {
                  quotes {
                    _id
                    quote
                    author
                  }
                }
              }
          `;
      const response = await fetch(APIS.endpoints.graphql, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      quotes = result.data.quotes.quotes;
      TABLE.actions.displayQuotes();
    },
    createQuote: async (quote, author) => {
      if (!quote || !author) {
        return DOM.toast.showToast("Please fill all fields", "error", 1000);
      }
      const mutation = `
              mutation CreateQuote($quoteInput: QuoteInputData!) {
                createQuote(quoteInput: $quoteInput) {
                  _id
                  quote
                  author
                }
              }
          `;
      const variables = {
        quoteInput: { quote, author },
      };
      const response = await fetch(APIS.endpoints.graphql, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation, variables }),
      });
      return response?.ok;
    },
    updateQuote: async (id, quote, author) => {
      if (!quote || !author) {
        return DOM.toast.showToast("Please fill all fields", "error", 1000);
      }
      const mutation = `
              mutation UpdateQuote($id: ID!, $quoteInput: QuoteInputData!) {
                updateQuote(id: $id, quoteInput: $quoteInput) {
                  _id
                  quote
                  author
                }
              }
          `;
      const variables = {
        id,
        quoteInput: { quote, author },
      };
      const response = await fetch(APIS.endpoints.graphql, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation, variables }),
      });
      return response?.ok;
    },
    deleteQuote: async (id) => {
      const mutation = `
              mutation DeleteQuote($id: ID!) {
                deleteQuote(id: $id) {
                  _id
                  quote
                  author
                }
              }
          `;
      const variables = { id };
      const response = await fetch(APIS.endpoints.graphql, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: mutation, variables }),
      });
      return response?.ok;
    },
  },
  api: {
    insertAllQuotes: async () => {
      const response = await fetch(APIS.endpoints.insertAllQuotes);
      const result = response?.ok;
      if (result) {
        APIS.graphql.fetchQuotes();
        DOM.toast.showToast("200 Quotes Added Successfully!");
      }
    },
    deleteAllQuotes: async () => {
      const response = await fetch(APIS.endpoints.deleteAllQuotes);
      const result = response?.ok;
      if (result) {
        APIS.graphql.fetchQuotes();
        DOM.toast.showToast("All Quotes Deleted Successfully!");
      }
    },
  },
};

function initializeApp() {
  DOM.initialize();
  TABLE.initialize();
  APIS.graphql.fetchQuotes();
}

initializeApp();

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.altKey && event.key === "x") {
    DOM.bulk.div.style = "block";
  }
});
