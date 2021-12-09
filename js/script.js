// Connexion à l'API
fetch('http://localhost:3000/api/products')
	.then((response) => response.json())
	.then((data) => {
		console.log("API Connexion = True");
		// Affiche tout les produits
		let showAllProduct = () => {
			let items = document.getElementById('items')
			for (let p in data) {
				items.innerHTML += `
					<a href="./product.html?id=${data[p]._id}">
						<article>
							<img src="${data[p].imageUrl}" alt="${data[p].altTxt}">
							<h3 class="productName">${data[p].name}</h3>
							<p class="productDescription">${data[p].description}</p>
						</article>
					</a>`
				// Vérifier qu'on a récupérer les données et les afficher dans l'onglet CONSOLE
				console.log(`URL de l'image : ${data[p].imageUrl}`)
				console.log(`Nom du produit : ${data[p].name}`)
				console.log(`Description : ${data[p].description}`)
			}
		}
		showAllProduct()
	})

// Afficher la quantité de notre panier
let cart = () => {
	let panier = document.getElementsByTagName('nav')[0].getElementsByTagName('li')[1]
	let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'))
	let sum = 0

	for (let q in saveProductLocalStorage) {
		let loop = parseInt(saveProductLocalStorage[q].qty)
		sum += loop
	}
	// On affiche uniquement la quantité supérieur à 0
	if(sum!==0){
		panier.innerHTML = `Panier <span id="test" style='color: white; background: green; margin : 0; width : 15px; border-radius : 50%; padding : 2px 8px 2px 8px;'>${sum}</span>`									
	}
}

cart()