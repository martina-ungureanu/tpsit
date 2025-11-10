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
      new Product(1, 'Pizza Margherita', 8, 'https://images.unsplash.com/photo-1601924582971-6e804e67d37e?auto=format&fit=crop&w=800&q=80'),
      new Product(2, 'Lasagna al Forno', 10, 'https://images.unsplash.com/photo-1603133872878-684f4bd92d5a?auto=format&fit=crop&w=800&q=80'),
      new Product(3, 'Tiramisù', 6, 'https://images.unsplash.com/photo-1625910860882-cb6bcb53c31a?auto=format&fit=crop&w=800&q=80'),
      new Product(4, 'Insalata Caprese', 7, 'https://images.unsplash.com/photo-1562967916-eb82221dfb36?auto=format&fit=crop&w=800&q=80')
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
