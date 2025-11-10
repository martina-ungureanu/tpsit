// app.js
const { createApp, ref, reactive, computed, defineComponent } = Vue

//-------------------------------------------------------------
// MODEL: rappresenta un prodotto del menù
//-------------------------------------------------------------
class Product {
  constructor(id, name, price, image) {
    this.id = id
    this.name = name
    this.price = price
    this.image = image
  }
}

//-------------------------------------------------------------
// CONTROLLER: gestisce logica del carrello
//-------------------------------------------------------------
const CartController = {
  addToCart(store, product) {
    store.items.push(product)
  },
  clearCart(store) {
    // svuotamento reattivo
    store.items.splice(0, store.items.length)
  },
  getTotal(store) {
    return store.items.reduce((sum, p) => sum + p.price, 0)
  }
}

//-------------------------------------------------------------
// COMPONENTE MenuItem → singolo piatto del menu
//-------------------------------------------------------------
const MenuItem = defineComponent({
  name: 'MenuItem',
  props: ['product'],
  emits: ['add'],
  template: `
    <div class="menu-item">
      <img :src="product.image" :alt="product.name" />
      <h3>{{ product.name }}</h3>
      <p>{{ product.price }} €</p>
      <button @click="$emit('add', product)">Aggiungi</button>
    </div>
  `
})

//-------------------------------------------------------------
// COMPONENTE CartView → vista del carrello
//-------------------------------------------------------------
const CartView = defineComponent({
  name: 'CartView',
  props: ['cart', 'total'],
  emits: ['clear'],
  template: `
    <div class="cart">
      <h2>🛒 Carrello</h2>

      <div v-if="cart.length > 0">
        <ul>
          <li v-for="(item, index) in cart" :key="index" class="cart-item">
            <img :src="item.image" :alt="item.name" />
            <span>{{ item.name }} - {{ item.price }} €</span>
          </li>
        </ul>
        <h3>Totale: {{ total }} €</h3>
        <button @click="$emit('clear')">Svuota carrello</button>
      </div>

      <p v-else>Nessun prodotto nel carrello.</p>
    </div>
  `
})

//-------------------------------------------------------------
// APP PRINCIPALE
//-------------------------------------------------------------
createApp({
  components: { MenuItem, CartView },

  setup() {
    // LOGIN DATI
    const username = ref('')
    const age = ref(null)
    const isLoggedIn = ref(false)
    const accessGranted = ref(false)
    const error = ref('')

    // STORE reattivo
    const cartStore = reactive({
      items: []
    })

    // LISTA PRODOTTI (MODEL)
    const products = [
      new Product(1, 'Bucket Tenders + HotWings', 18, 'lavoro di gruppo tipst/immagini/buchet tender.png'),
      new Product(2, 'Bucket Vegano', 13, 'lavoro di gruppo tipst/immagini/buchet vegano.png'),
      new Product(3, '9 Nuggets + Salsa', 6, 'lavoro di gruppo tipst/immagini/9 nuggets + salsa.png'),
      new Product(4, 'Box HotDog Spicy', 9, 'lavoro di gruppo tipst/immagini/box hot dog spicy.png'),
      new Product(5, 'Box HotDog Cheesy', 9, 'lavoro di gruppo tipst/immagini/box meal hot dog cheesy.png'),
      new Product(6, 'Box Colonnels Burger', 10.95, 'lavoro di gruppo tipst/immagini/box meal Colonels.png'),
      new Product(7, 'Box Cheese and Becon Burger', 12.95, 'lavoro di gruppo tipst/immagini/box meal cheese e bacon.png'),
      new Product(8, 'Classic Chicken Burger', 4.90, 'lavoro di gruppo tipst/immagini/classic.png'),
      new Product(9, 'Vegan Burger', 4.90, 'lavoro di gruppo tipst/immagini/classico vegetariano.png'),
      new Product(10, 'Cheesy Doritos Fries', 3.87, 'lavoro di gruppo tipst/immagini/doritos fries cheesy.png'),
      new Product(11, 'Spicy Doritos Fries', 3.87, 'lavoro di gruppo tipst/immagini/doritos fries spicy.png'),
      new Product(12, 'Double Chicken BBQ and Becon', 5.98, 'lavoro di gruppo tipst/immagini/double BBQ.png'),
      new Product(13, 'HotDog Spicy', 13, 'lavoro di gruppo tipst/immagini/hot hod dog spicy.png'),
      new Product(14, 'Menù Famiglia Normale', 25, 'lavoro di gruppo tipst/immagini/menu famiglia 2 menu large e 1 junior.png'),
      new Product(15, 'Menù Famiglia Grande', 28.45, 'lavoro di gruppo tipst/immagini/menu famiglia 2 menu large e 2 junior.png'),
      new Product(16, 'Wrap di Pollo', 8.12, 'lavoro di gruppo tipst/immagini/wrap colonel.png'),
      new Product(17, 'Wrap Vegano', 8.12, 'lavoro di gruppo tipst/immagini/wrap vegano.png'),

    ]

    // COMPUTED → totale aggiornato
    const total = computed(() => CartController.getTotal(cartStore))

    // LOGIN
    function login() {
      if (username.value.trim() === '') {
        error.value = 'Inserisci il nome utente.'
        return
      }
      if (!age.value || age.value < 18) {
        error.value = 'Accesso negato: devi essere maggiorenne.'
        return
      }

      isLoggedIn.value = true
      accessGranted.value = true
      error.value = ''
    }

    // Aggiunge al carrello
    function addToCart(product) {
      CartController.addToCart(cartStore, product)
    }

    // Svuota carrello
    function clearCart() {
      CartController.clearCart(cartStore)
    }

    return {
      username, age, isLoggedIn, accessGranted, error,
      products,
      cart: cartStore.items,
      total,
      login,
      addToCart,
      clearCart
    }
  }
}).mount('#app')

