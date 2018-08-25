class CmpCategorical extends HTMLElement {

    // TODO: Fix font load from material design

    constructor() {
        super();

        this.i18n = {
            "pt": {
                "select-default-option": "Selecione uma opção",
                "weight-label": "Impacto na produção",
                "justify-label": "Justificativa",
                "justify-placeholder": "Justificar",
                "reset-label": "Limpar"
            },
            "en": {
                "select-default-option": "Select an option",
                "weight-label": "Impact on production",
                "justify-label": "Justification",
                "justify-placeholder": "Justify",
                "reset-label": "Reset"
            },
        };
    }

    render(category, lang) {
        console.log('cmp-categorical render function executing');

        let questions = category.subClass;
        let htmlQuestions = `<div class="section"><div class="card"><div class="card-content"><h4 class="center-align">${category.label}</h4>`;
        let questionCounter = 0;
        const hasWeight = "hasWeight" in category;

        if(!Array.isArray(questions)) questions = new Array(questions);

        questions.forEach(question => {
            let questionTitle = `<div class="card"><div class="card-content"><span class="card-title">${++questionCounter}. ${question.label}</span><div class="divider"></div><button id="justifyButton.${category.label}.${questionCounter}" class="waves-effect waves-light btn-small right">${this.i18n[lang]["justify-label"]}</button><button id="resetButton.${category.label}.${questionCounter}" class="waves-effect waves-light btn-small right">${this.i18n[lang]["reset-label"]}</button><br>`;

            let questionOptions = ``;
            question.value.forEach(option => {
                questionOptions += `<p><label><input name="${question["@id"]}" type="radio" value="${option["@id"]}" /><span>${option.label}</span></label></p>`
            });

            if(hasWeight) {
                questionOptions += `<div class="input-field"><label>${this.i18n[lang]["weight-label"]}:</label><br><br><select class="browser-default" id="weight" name="${question["@id"]}"><option value="">${this.i18n[lang]["select-default-option"]}</option>`;

                category.hasWeight.forEach(weight => {
                    questionOptions += `<option value="${weight["@id"]}">${weight.label}</option>`;
                });

                questionOptions += `</select></div>`
            }

            questionOptions += `<div class="input-field"><label id="justifyLabel" class="hide">${this.i18n[lang]["justify-label"]}:</label><br><br><textarea id="justifyTextArea" placeholder="${this.i18n[lang]["justify-placeholder"]}" style="resize: none;" class="hide"></textarea></div>`;
            questionOptions += `</div></div>`;
            htmlQuestions += questionTitle;
            htmlQuestions += questionOptions;
        });

        htmlQuestions += `</div></div></div><div class="divider"></div>`;
        this.shadowRoot.innerHTML += htmlQuestions;

        for(let i = 1; i <= questionCounter; ++i) {
            const justifyButton = this.shadowRoot.getElementById(`justifyButton.${category.label}.${i}`);
            justifyButton.addEventListener("click", e => this.toggleJustify(e));

            const resetButton = this.shadowRoot.getElementById(`resetButton.${category.label}.${i}`);
            resetButton.addEventListener("click", e => this.resetAnswer(e));
        }

        console.log('Categorical component rendered');
    }

    /**
     * Hide or show the justify text area element
     * @param event MouseClickEvent on justify dedicated button
     */
    toggleJustify(event) {
        let justifyTextArea = event.target.parentNode.querySelector("#justifyTextArea");
        let justifyLabel = event.target.parentNode.querySelector("#justifyLabel");

        Rust.decisioner.then( function( test ) {
            console.log(test);
            console.log( test.hash( "Hello world!" ) );
        });

        if(justifyTextArea.classList.contains("hide")) {
                justifyLabel.classList.remove("hide");
                justifyTextArea.classList.remove("hide");
        }
        else {
            justifyTextArea.classList.add("hide");
            justifyLabel.classList.add("hide");
        }
    }

    /**
     * Reset all input fields of a specific category topic
     * @param event MouseClickEvent on reset dedicated button
     */
    resetAnswer(event) {
        let selectWeight = event.target.parentNode.querySelector("#weight");
        if(selectWeight) selectWeight.selectedIndex = 0;

        let justifyTextArea = event.target.parentNode.querySelector("#justifyTextArea");
        justifyTextArea.value = justifyTextArea.defaultValue;

        let radioInputs = event.target.parentNode.querySelectorAll("input[type=radio]");
        radioInputs.forEach(radio => {
            radio.checked = false;
        });
    }

    /**
     * Callback that is executed when the web component is inserted in the DOM tree
     */
    connectedCallback() {
        const shadowRoot = this.attachShadow({mode: 'open'});
        console.log("Categorical component connected");

        // Clone the template and the cloned node to the shadowDOM's root.
        const eulCategoricalTemplate = document.createElement('template');
        eulCategoricalTemplate.innerHTML = `<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"><link rel="stylesheet" href="../../css/materialize.min.css" media="screen,projection">`;
        const instance = eulCategoricalTemplate.content.cloneNode(true);
        shadowRoot.appendChild(instance);

        // Get the attributes values
        const category = JSON.parse(this.getAttribute('category'));
        const lang = this.getAttribute('language');

        this.render(category, lang);
    }
}

customElements.define('cmp-categorical', CmpCategorical);