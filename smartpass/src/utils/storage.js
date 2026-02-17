const STORAGE_KEY = 'smartpass_boarding_passes';

/**
 * Get all boarding passes from localStorage
 * @returns {Array<Object>}
 */
export function getAllPasses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return [];
  }
}

/**
 * Save a new boarding pass
 * @param {Object} pass 
 * @returns {Object} Saved pass with ID
 */
export function savePass(pass) {
  const passes = getAllPasses();
  const newPass = {
    ...pass,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  passes.push(newPass);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
    return newPass;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    throw error;
  }
}

/**
 * Delete a boarding pass by ID
 * @param {string} id 
 */
export function deletePass(id) {
  const passes = getAllPasses();
  const filtered = passes.filter(p => p.id !== id);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting from localStorage:', error);
    throw error;
  }
}

/**
 * Update a boarding pass
 * @param {string} id 
 * @param {Object} updates 
 */
export function updatePass(id, updates) {
  const passes = getAllPasses();
  const index = passes.findIndex(p => p.id === id);
  
  if (index !== -1) {
    passes[index] = { ...passes[index], ...updates };
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
      return passes[index];
    } catch (error) {
      console.error('Error updating localStorage:', error);
      throw error;
    }
  }
  
  return null;
}

/**
 * Clear all boarding passes
 */
export function clearAllPasses() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    throw error;
  }
}
