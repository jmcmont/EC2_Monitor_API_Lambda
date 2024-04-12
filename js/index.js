window.addEventListener("load", loadInstances);
instancesTable = document.querySelector("#data-table tbody");

async function loadInstances() {
    url =
        "https://1q52pe2ps0.execute-api.us-east-1.amazonaws.com/Prod/get_instances";

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    }).then((response) => response.json());

    renderInstances(response);
    handlerActionButton();
}

function renderInstances(response) {
    instancesTable.innerHTML = "";

    response.instances.forEach(function (instance) {


        var row = document.createElement("tr");

        row.innerHTML = `<td>${instance.InstanceId}</td>
                <td>${instance.Name}</td>
                <td>${instance.PublicIP}</td>
                <td>${instance.State}</td>
                <td>${instance.PublicDNS}</td>
                <td>${instance.PrivateIP}</td>`;

        if (instance.State == "running") {
            action = "Stop"
            row.innerHTML += `<td>
            <a type="button" class="btn btn-primary m-2 action-button" 
            data-instance='${instance.InstanceId}' data-action=${action}> ${action} </a>
            </td>`;
        } else if (instance.State == "stopped") {
            action = "Start"
            row.innerHTML += `<td>
            <a type="button" class="btn btn-primary m-2 action-button" 
            data-instance='${instance.InstanceId}' data-action=${action}> ${action} </a>
            </td>`;
        } else {
            row.innerHTML += `<td>
            <span>${instance.State}</span>
            </td>`;
        }

        instancesTable.appendChild(row);
    });


}


async function actionInstance(instanceId, action) {
    url =
        "https://1q52pe2ps0.execute-api.us-east-1.amazonaws.com/Prod/action_instances?";
    url += "instanceId=" + encodeURIComponent(instanceId);
    url += "&action=" + encodeURIComponent(action);

    try {
        response = await fetch(url, {
            method: "POST",
            headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then((response) => response.json());

        if (response.status === 200) {
            alert("Se completo la operacion: " + action + " \nSe recargará la tabla\nSi no cambia el estatus, por favor, recargue la página. ")
        }
        else {
            alert("La operacion:" + action + " \n No se pudo realizar. ")
        }

    } catch (error) {
        alert("Error al enviar la solicitud");
    }
}

async function handlerActionButton() {
    const actionButtons = document.querySelectorAll(".action-button");

    actionButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            instance = button.dataset.instance;
            action = button.dataset.action;
            await actionInstance(instance, action);
            setTimeout(loadInstances, 2000);
        });
    });
}
