        let btnEkle = document.getElementById('ekle');
        var listeContainer=document.getElementById('listeContainer')
        var listArray=[];


document.getElementById('yukle').addEventListener('change', function(event) {
    let file = event.target.files[0];

    if (file) {
        let reader = new FileReader();
        reader.onload = function(e) {
            try {
                let jsonData = JSON.parse(e.target.result);

                if (Array.isArray(jsonData)) {
                    listArray = jsonData;
                    listeContainer.innerHTML = "";

                    jsonData.forEach(task => {
                        console.log("Task:", task); // Ek kontrol
                        createDiv(task);
                    });

                    alert("✅ JSON dosyası başarıyla yüklendi!");
                } else {
                    alert("❌ Geçerli bir JSON formatı değil!");
                }
            } catch (error) {
                alert("⚠️ JSON okunamadı: " + error.message);
            }
        };
        reader.readAsText(file);
    } else {
        alert("❗ Bir dosya seçilmedi.");
    }
});


document.getElementById('kaydet').addEventListener('click', function () {
    if (listArray.length === 0) {
        alert("Kaydedilecek veri bulunamadı! ❌");
        return;
    }

    let jsonData = JSON.stringify(listArray, null, 4); // JSON formatına çevir
    let blob = new Blob([jsonData], { type: "application/json" }); // JSON dosyasını oluştur
    let url = URL.createObjectURL(blob); // Geçici URL oluştur

    let a = document.createElement("a");
    a.href = url;
    a.download = "tasks.json"; // Dosya adı belirle
    document.body.appendChild(a);
    a.click(); // Otomatik olarak indirme işlemini başlat
    document.body.removeChild(a);

    URL.revokeObjectURL(url); // Bellek temizliği yap 
});


function addFx() {
        let konuArea=document.getElementById('konuArea');
        let icerikArea=document.getElementById('icerikArea');
        let durum=true;

        if (   konuArea.value.trim()==="" ) { alert("konu ekleyin");   durum=false;}
        if ( icerikArea.value.trim()==="" ) { alert("içerik ekleyin"); durum=false;}

        if (durum==true){
                var lineContent={
                        konu:      konuArea.value.trim(),
                        content:   icerikArea.value.trim()
                }
                listArray.push(lineContent);
                createDiv(lineContent);
        }
}

function createDiv(lineContent){
    let { konu, content } = lineContent;
    let element = document.createElement('div');
    element.innerHTML = `
        <div class="row mt-3">
            <div class="form-group col-md-1">
                <button type="button" class="btn btn-primary btndegistir">Değiştir</button>
                </div>
            <div class="form-group col-md-2">
                <textarea class="form-control btnkonuArea" rows="1" placeholder="Konu">${konu}</textarea>
                </div>
            <div class="form-group col-md-8">
                <textarea class="form-control btnicerikArea" rows="1" placeholder="İçerik">${content}</textarea>
                </div>
            <div class="form-group col-md-1">
                <button type="button" class="btn btn-danger btnkaldir">Kaldır</button>
                </div>
        </div>`;

    listeContainer.appendChild(element);

    let btnkaldir = element.querySelector('.btnkaldir');
    btnkaldir.addEventListener("click", function () {
        let konuToRemove = element.querySelector('.btnicerikArea').value.trim(); 

        listArray = listArray.filter(function (lineContent) {
            return lineContent.content !== konuToRemove;
        });

        element.remove();
        localStorage.setItem("taskArray", JSON.stringify(listArray));
    });

    let btndegistir = element.querySelector('.btndegistir'); 
    let btnicerikArea = element.querySelector('.btnicerikArea'); 

    btndegistir.addEventListener("click", function () {
        if (btndegistir.innerText === 'Değiştir') {
            btnicerikArea.removeAttribute('readonly');
            btnicerikArea.focus();
            btndegistir.innerText = 'Kaydet';
        } else {
            btnicerikArea.setAttribute('readonly', true);
            let updatedText = btnicerikArea.value.trim();

            if (updatedText !== "") {
                listArray = listArray.map(function (lineContent) {
                    if (lineContent.content === btnicerikArea.defaultValue) {
                        lineContent.content = updatedText;
                    }
                    return lineContent;
                });

                localStorage.setItem("taskArray", JSON.stringify(listArray));
            }
            btndegistir.innerText = 'Değiştir';
        }
    });
}

