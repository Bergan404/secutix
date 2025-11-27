document.addEventListener("DOMContentLoaded", () => {

    let previewFormat = "standard";

    const previewBox = document.getElementById("jsonPreview");

    const renderPreview = () => {
        const jsonOutput = {};
        document.querySelectorAll(".msc-block").forEach(block => {
            const mscValue = block.querySelector(".msc-input").value.trim();
            const defValue = block.querySelector(".def-input").value.trim();
            const ruleValue = block.querySelector(".rule-input").value.trim();
            const specs = Array.from(block.querySelectorAll(".spec-input"))
                .map(input => input.value.trim())
                .filter(value => value !== "");
            
            if (mscValue) {
                jsonOutput[mscValue] = {};
                if (defValue) jsonOutput[mscValue]["def"] = defValue;
                if (specs.length) jsonOutput[mscValue]["specs"] = specs;
                if (ruleValue) jsonOutput[mscValue]["rule"] = ruleValue;
            }
        });
    
        previewBox.textContent = previewFormat === "compact"
            ? JSON.stringify(jsonOutput)
            : JSON.stringify(jsonOutput, null, 4);
    };

    document.getElementById("standardView").addEventListener("click", () => {
        previewFormat = "standard";
        renderPreview();
    });
    
    document.getElementById("compactView").addEventListener("click", () => {
        previewFormat = "compact";
        renderPreview();
    });

    const container = document.getElementById("container");
    const defaultText = document.getElementById("default_text");
    const addMSCButton = document.getElementById("addMSC");
    const downloadButton = document.getElementById("downloadJSON");
    const importInput = document.getElementById("importJSON");

    const createMSCBlock = (mscValue = "", defValue = "", specs = [], ruleValue = "") => {
        const MSCBlock = document.createElement("div");
        MSCBlock.classList.add("msc-block");

        MSCBlock.innerHTML = `
            <label>Manager Seat Category (MSC) :</label>
            <input type="text" class="msc-input" value="${mscValue}">
            <label>Default Category (DEF) :</label>
            <input type="text" class="def-input" value="${defValue}">
            <label>Specs:</label>
            <div class="specs-container"></div>
            <button class="add-spec">Add Spec</button>
            <label>Rule:</label>
            <input type="text" class="rule-input" value="${ruleValue}">
            <button class="remove-msc">Remove</button>
            <hr>
        `;

        const specContainer = MSCBlock.querySelector(".specs-container");

        const createSpecInput = (value = "") => {
            const specInput = document.createElement("input");
            specInput.type = "text";
            specInput.classList.add("spec-input");
            specInput.value = value;
            specInput.addEventListener("input", renderPreview);

            // Add Enter key listener to add new input
            specInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // prevent form submission
                    const newInput = createSpecInput();
                    specContainer.appendChild(newInput);
                    newInput.focus();
                }
            });

            return specInput;
        };

        // Add initial spec inputs
        specs.forEach(spec => {
            const specInput = createSpecInput(spec);
            specContainer.appendChild(specInput);
        });


        MSCBlock.querySelector(".add-spec").addEventListener("click", (e) => {
            e.preventDefault();
            const specInput = createSpecInput();
            specContainer.appendChild(specInput);
            specInput.focus();
        });

        MSCBlock.querySelector(".msc-input").addEventListener("input", renderPreview);
        MSCBlock.querySelector(".def-input").addEventListener("input", renderPreview);
        MSCBlock.querySelector(".rule-input").addEventListener("input", renderPreview);


        MSCBlock.querySelector(".remove-msc").addEventListener("click", () => {
            MSCBlock.remove();
            renderPreview();
        });

        container.appendChild(MSCBlock);
    };

    addMSCButton.addEventListener("click", () => {
        if (container.contains(defaultText)) {
            container.removeChild(defaultText);
        }
        createMSCBlock();
        renderPreview();
    });
    

    downloadButton.addEventListener("click", () => {
        const jsonOutput = {};
        document.querySelectorAll(".msc-block").forEach(block => {
            const mscValue = block.querySelector(".msc-input").value.trim();
            const defValue = block.querySelector(".def-input").value.trim();
            const ruleValue = block.querySelector(".rule-input").value.trim();
            const specs = Array.from(block.querySelectorAll(".spec-input"))
                .map(input => input.value.trim())
                .filter(value => value !== "");

            if (mscValue) {
                jsonOutput[mscValue] = {};
                if (defValue) jsonOutput[mscValue]["def"] = defValue;
                if (specs.length) jsonOutput[mscValue]["specs"] = specs;
                if (ruleValue) jsonOutput[mscValue]["rule"] = ruleValue;
            }
        });

        const blob = new Blob([JSON.stringify(jsonOutput, null, 4)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "data.json";
        a.click();
    });

    importInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    container.innerHTML = "";
                    Object.entries(jsonData).forEach(([msc, data]) => {
                        createMSCBlock(msc, data.def || "", data.specs || [], data.rule || "");
                    });
                    renderPreview();
                } catch (error) {
                    alert("Invalid JSON file");
                }
            };
            reader.readAsText(file);
        }
    });
    input.addEventListener("input", renderPreview);

    
});