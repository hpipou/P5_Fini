
// lire les datas dans le localStorage
let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'))
let saveContactLocalStorage = JSON.parse(localStorage.getItem('contact'))

// Sélectionner le conteneur des articles
let cartItems = document.querySelector('#cart__items')

// Création d'un tableau produit vide
let products = []

fetch('http://localhost:3000/api/products')
	.then((response) => response.json())
	.then((data) => {
		// *** Trouver l'objet correspondant à l'ID | object._id : API | id : searchParams
		let findObject = (id) => {
			return data.find((object) => object._id === id)
		}

		let showCart = () => {
			// *** Affiche tout les produits du panier
			if (document.URL.includes('cart.html')) {
				for (let i in saveProductLocalStorage) {
					let id = saveProductLocalStorage[i]._id
					let myObject = findObject(id)
					let price = myObject.price * saveProductLocalStorage[i].qty

					cartItems.innerHTML += `
						<article class="cart__item" data-id="${saveProductLocalStorage[i]._id}" data-color="${saveProductLocalStorage[i].colors}">
						<div class="cart__item__img">
						<img src="${myObject.imageUrl}" alt="${myObject.alttxt}" />
						</div>
						<div class="cart__item__content">
						<div class="cart__item__content__description">
							<h2>${myObject.name}</h2>
							<p>${saveProductLocalStorage[i].colors}</p>
							<p class="priceProduct">${price} €</p>
						</div>
						<div class="cart__item__content__settings">
							<div class="cart__item__content__settings__quantity">
							<p>Qté :</p>
							<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${saveProductLocalStorage[i].qty}"/>
							</div>
							<div class="cart__item__content__settings__delete">
							<p class="deleteItem">Supprimer</p>
							</div>
							</div>
						</div>
						</article>`
					console.log("Produit N°" + i + " " + myObject.name);
					// Mets dans le tableau produit les ID du panier
					let productsId = [saveProductLocalStorage[i]._id]
					products.push(productsId)
				}
			}
		}

		// *** Supprimer un produit
		let deleteProduct = () => {
			// Stock dans un tableau les boutons supprimer du DOM
			let deleteButton = [...document.querySelectorAll('.deleteItem')]
			let deleteArticle = [...document.querySelectorAll('.cart__item')]
			let ls = saveProductLocalStorage

			// Ecoute le click sur tout les boutons supprimer
			deleteButton.forEach((element, index) => {
				element.addEventListener('click', () => {
					// Chercher l'index via la couleur et l'id du dataset
					let indexDom = saveProductLocalStorage.findIndex(
						(e) =>
							e.colors === deleteArticle[index].dataset.color &&
							e._id === deleteArticle[index].dataset.id
					)

					if (indexDom !== -1) {
						// Supprime dans le localStorage
						ls.splice(indexDom, 1)
						localStorage.setItem('product', JSON.stringify(ls))
						// Supprime sur le DOM
						deleteArticle[index].remove()
						// Si tableau vide, supprimer
						if (saveProductLocalStorage == '') {
							localStorage.removeItem('product')
							products = ''
						}
					}

					cart()
					total()
				})
			})
		}

		// *** Modifie la quantité d'un produit
		let modifyProduct = () => {
			// Stock dans un tableaux les éléments du DOM à modifier
			let quantityContainer = [
				...document.getElementsByClassName('itemQuantity'),
			]
			// Modifie la quantité
			quantityContainer.forEach((item, index) => {
				// Au click, modifie l'item sur le LocalStorage
				item.addEventListener('change', () => {
					if (quantityContainer[index].value > 100) {
						quantityContainer[index].value = 100
					} else {
						saveProductLocalStorage[index].qty = quantityContainer[index].value
						localStorage.setItem(
							'product',
							JSON.stringify(saveProductLocalStorage)
						)
					}

					let priceProduct = document.getElementsByClassName('priceProduct')

					let oneItemTotal = () => {
						let id = saveProductLocalStorage[index]._id
						let myObject = findObject(id)
						let price = myObject.price * saveProductLocalStorage[index].qty
						priceProduct[index].innerHTML = `${price} €`
					}

					oneItemTotal()
					cart()
					total()
				})
			})
		}

		let total = () => {
			// *** Totaux : article et €
			let sumProduct = 0
			let sumMoney = 0
			let totalQuantity = document.querySelector('#totalQuantity')
			let totalMoney = document.querySelector('#totalPrice')

			if (document.URL.includes('cart.html')) {
				for (let q in saveProductLocalStorage) {
					let id = saveProductLocalStorage[q]._id
					let myObjectTotal = findObject(id)

					let quantityLoop = parseInt(saveProductLocalStorage[q].qty)
					sumProduct += quantityLoop

					let moneyLoop = parseInt(myObjectTotal.price)
					sumMoney += moneyLoop * quantityLoop
				}
				totalQuantity.innerHTML = sumProduct
				totalMoney.innerHTML = sumMoney
				console.log("Prix total des produits = " + sumMoney)
			}
		}

		showCart()
		deleteProduct()
		modifyProduct()
		total()

		// *** Formulaire Contact
		addEventListener('change', () => {
			function validFirstName() {
				let firstName = document.getElementById('firstName').value
				let text = document.getElementById('firstNameErrorMsg')
				// Prends en compte les accents
				let pattern =
					/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
				let number = /^[a-zA-Z\-1-9]+$/

				if (firstName.match(pattern)) {
					text.innerHTML = 'Prénom valide'
					text.style.color = '#00ff00'
					return firstName
				} else {
					if (firstName.match(number)) {
						text.innerHTML = 'Les chiffres ne sont pas tolérés'
						text.style.color = '#fbbcbc'
					} else {
						text.innerHTML = 'Merci de rentrer un prénom valide'
						text.style.color = '#fbbcbc'
					}
				}
				if (firstName == '') {
					text.innerHTML = ''
				}
			}

			function validLastName() {
				let lastName = document.getElementById('lastName').value
				let text = document.getElementById('lastNameErrorMsg')
				let pattern =
					/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u
				let number = /^[a-zA-Z\-1-9]+$/

				if (lastName.match(pattern)) {
					text.innerHTML = 'Nom valide'
					text.style.color = '#00ff00'
					return lastName
				} else {
					if (lastName.match(number)) {
						text.innerHTML = 'Les chiffres ne sont pas tolérés'
						text.style.color = '#fbbcbc'
					} else {
						text.innerHTML = 'Merci de rentrer un nom valide'
						text.style.color = '#fbbcbc'
					}
				}
				if (lastName == '') {
					text.innerHTML = ''
				}
			}

			function validAdress() {
				let address = document.getElementById('address').value
				let text = document.getElementById('addressErrorMsg')
				let pattern = '([0-9a-zA-Z,. ]*) ?([0-9]{5}) ?([a-zA-Z]*)'

				if (address.match(pattern)) {
					text.innerHTML = 'Adresse postale valide'
					text.style.color = '#00ff00'
					return address
				} else {
					text.innerHTML =
						'Merci de rentrer une adresse valide : numéro voie code postal'
					text.style.color = '#fbbcbc'
				}
				if (address == '') {
					text.innerHTML = ''
				}
			}

			function validCity() {
				let city = document.getElementById('city').value
				let text = document.getElementById('cityErrorMsg')
				let pattern = /^[a-z ,.'-]+$/i

				if (city.match(pattern)) {
					text.innerHTML = 'Ville valide'
					text.style.color = '#00ff00'
					return city
				} else {
					text.innerHTML = 'Merci de rentrer une ville valide'
					text.style.color = '#fbbcbc'
				}
				if (city == '') {
					text.innerHTML = ''
				}
			}

			function validEmail() {
				let mail = document.getElementById('email').value
				let text = document.getElementById('emailErrorMsg')
				// ^ : début
				// dans les crochets ce qu'on peut écrire, miniscule, majustucle, nombre, point, tiret, underscore
				// après le '+' l'élément suivant ; puis entre accolade le nombre de fois où il peut être répété
				// $ : fin
				let pattern = new RegExp(
					'^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$',
					'g'
				)

				if (mail.match(pattern)) {
					text.innerHTML = 'Adresse email valide'
					text.style.color = '#00ff00'
					return mail
				} else {
					text.innerHTML = 'Merci de rentrer une adresse valide'
					text.style.color = '#fbbcbc'
				}
				if (mail == '') {
					text.innerHTML = ''
				}
			}

			// Appels pour alertes sur DOM
			validFirstName()
			validLastName()
			validAdress()
			validCity()
			validEmail()

			// *** Objet vers localStorage
			let sendContact = document.querySelector('#order')
			sendContact.addEventListener('click', (e) => {
				e.preventDefault()

				// Création de l'objet contact | Les valeurs sont vérifiés par les fonctions
				let contact = {
					firstName: validFirstName(),
					lastName: validLastName(),
					address: validAdress(),
					city: validCity(),
					email: validEmail(),
				}

				// Ajoute le nouveau contact
				let addContactLocalStorage = () => {
					saveContactLocalStorage = []
					saveContactLocalStorage.push(contact)
					localStorage.setItem(
						'contact',
						JSON.stringify(saveContactLocalStorage)
					)
				}

				// Modifie le contact
				let modifyContactLocalStorage = () => {
					saveContactLocalStorage = contact
					localStorage.setItem(
						'contact',
						JSON.stringify(saveContactLocalStorage)
					)
				}

				// Si l'objet a une key non défini, ne pas exécuter le code
				if (
					contact.firstName == undefined ||
					contact.lastName == undefined ||
					contact.address == undefined ||
					contact.city == undefined ||
					contact.email == undefined
				) {
					return false
				} else {
					// SI pas de contact dans le localStorage, crée le tableau
					if (!saveContactLocalStorage) {
						addContactLocalStorage()
					}
					// Modifie le contact en temps réel
					else {
						modifyContactLocalStorage()
					}
				}

				const toSend = {
					contact,
					products,
				}

				const promiseOne = fetch('http://localhost:3000/api/products/order', {
					method: 'POST',
					body: JSON.stringify(toSend),
					headers: {
						'Content-type': 'application/json',
					},
				})

				// Pour voir le résultat du serveur dans la console
				promiseOne.then(async (response) => {
					try {
						const content = await response.json()
						if (response.ok && saveProductLocalStorage) {
							window.location = `../html/confirmation.html?id=${content.orderId}`
							localStorage.clear()
						} else {
							console.log(`Réponse du serveur : `, response.status)
						}
					} catch (e) {
						console.log('Erreur qui vient du catch : ', e)
					}
				})
			})
		})
	})

// *** Rajouter la quantité totale à côté du panier (nav bar)
let cart = () => {
	let panier = document
		.getElementsByTagName('nav')[0]
		.getElementsByTagName('li')[1]

	let saveProductLocalStorage = JSON.parse(localStorage.getItem('product'))

	let sum = 0
	for (let q in saveProductLocalStorage) {
		let loop = parseInt(saveProductLocalStorage[q].qty)
		sum += loop
	}
	if(sum!==0){
		panier.innerHTML = `Panier <span id="test" style='color: white; background: green; margin : 0; width : 15px; border-radius : 50%; padding : 2px 8px 2px 8px;'>${sum}</span>`									
	}else{
		if(document.querySelector('.cart__order')){document.querySelector('.cart__order').style.display = "none";}
		if(document.querySelector('.cart__price')){document.querySelector('.cart__price').style.display = "none";}
		if(document.querySelector('#test')){document.querySelector('#test').style.display = "none";}
		if(document.querySelector('h1')){document.querySelector('h1').textContent = "Votre panier est vide !";}
	}
}
// *** Confirmation du numéro de commande
const orderId = new URL(window.location.href).searchParams.get('id')
let showCommand = () => {
	const idSelector = document.querySelector('#orderId')
	if (document.URL.includes('confirmation.html')) {
		idSelector.innerHTML = orderId
	}
}

cart();
showCommand();