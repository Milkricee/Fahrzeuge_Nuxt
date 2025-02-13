import { ref } from 'vue';

const searchQuery = ref('');

export function updateSearchQuery(newQuery) {
  // Sicherstellen, dass newQuery ein String ist, bevor es zugewiesen wird
  searchQuery.value = typeof newQuery === 'string' ? newQuery : String(newQuery); 
}

export { searchQuery };