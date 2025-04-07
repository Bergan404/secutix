document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
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
        specs.forEach(spec => {
            const specInput = document.createElement("input");
            specInput.type = "text";
            specInput.classList.add("spec-input");
            specInput.value = spec;
            specContainer.appendChild(specInput);
        });
        
        MSCBlock.querySelector(".add-spec").addEventListener("click", (e) => {
            e.preventDefault();
            const specInput = document.createElement("input");
            specInput.type = "text";
            specInput.classList.add("spec-input");
            specContainer.appendChild(specInput);
        });
        
        MSCBlock.querySelector(".remove-msc").addEventListener("click", () => {
            MSCBlock.remove();
        });
        
        container.appendChild(MSCBlock);
    };
    
    addMSCButton.addEventListener("click", () => {
        createMSCBlock();
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
                } catch (error) {
                    alert("Invalid JSON file");
                }
            };
            reader.readAsText(file);
        }
    });
});