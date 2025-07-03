import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { savedRecipeService } from '@/services/api/savedRecipeService';
import { recipeService } from '@/services/api/recipeService';

const RecipeCollectionManager = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [savedData, foldersData, allRecipes] = await Promise.all([
        savedRecipeService.getAll(),
        savedRecipeService.getAllFolders(),
        recipeService.getAll()
      ]);
      
      setSavedRecipes(savedData);
      setFolders(foldersData);
      
      // Load full recipe details
      const fullRecipes = savedData.map(savedRecipe => {
        const fullRecipe = allRecipes.find(recipe => recipe.Id === savedRecipe.recipeId);
        return { 
          ...fullRecipe, 
          savedAt: savedRecipe.savedAt, 
          savedId: savedRecipe.Id,
          folderId: savedRecipe.folderId
        };
      }).filter(Boolean);
      
      setRecipes(fullRecipes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    try {
      const newFolder = await savedRecipeService.createFolder({
        name: folderName.trim(),
        parentId: currentFolder?.Id || null
      });
      
      setFolders(prev => [...prev, newFolder]);
      setFolderName('');
      setShowCreateFolder(false);
      toast.success(`Folder "${newFolder.name}" created successfully`);
    } catch (err) {
      toast.error('Error creating folder');
    }
  };

  const handleDeleteFolder = async (folderId) => {
    if (!confirm('Are you sure you want to delete this folder? Recipes will be moved to the root level.')) {
      return;
    }

    try {
      await savedRecipeService.deleteFolder(folderId);
      setFolders(prev => prev.filter(f => f.Id !== folderId));
      
      // Update recipes to reflect folder removal
      setRecipes(prev => prev.map(recipe => 
        recipe.folderId === folderId 
          ? { ...recipe, folderId: null }
          : recipe
      ));
      
      if (currentFolder?.Id === folderId) {
        setCurrentFolder(null);
      }
      
      toast.success('Folder deleted successfully');
    } catch (err) {
      toast.error('Error deleting folder');
    }
  };

  const handleMoveRecipe = async (recipeId, targetFolderId) => {
    try {
      await savedRecipeService.moveToFolder(recipeId, targetFolderId);
      
      setRecipes(prev => prev.map(recipe => 
        recipe.savedId === recipeId 
          ? { ...recipe, folderId: targetFolderId }
          : recipe
      ));
      
      const folderName = targetFolderId 
        ? folders.find(f => f.Id === targetFolderId)?.name 
        : 'Root';
      
      toast.success(`Recipe moved to ${folderName}`);
    } catch (err) {
      toast.error('Error moving recipe');
    }
  };

  const getCurrentFolderRecipes = () => {
    const folderId = currentFolder?.Id || null;
    return recipes.filter(recipe => recipe.folderId === folderId);
  };

  const getFilteredRecipes = () => {
    const currentRecipes = getCurrentFolderRecipes();
    if (!searchTerm) return currentRecipes;
    
    return currentRecipes.filter(recipe => 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'All Recipes', folder: null }];
    if (currentFolder) {
      breadcrumbs.push({ name: currentFolder.name, folder: currentFolder });
    }
    return breadcrumbs;
  };

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredRecipes = getFilteredRecipes();
  const currentFolders = folders.filter(f => f.parentId === (currentFolder?.Id || null));

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-sm">
        {getBreadcrumbs().map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            {index > 0 && <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />}
            <button
              onClick={() => setCurrentFolder(crumb.folder)}
              className={`hover:text-primary transition-colors ${
                crumb.folder === currentFolder ? 'text-primary font-medium' : 'text-gray-600'
              }`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="small"
            icon="FolderPlus"
            onClick={() => setShowCreateFolder(true)}
          >
            New Folder
          </Button>
          {currentFolder && (
            <Button
              variant="ghost"
              size="small"
              icon="ArrowLeft"
              onClick={() => setCurrentFolder(null)}
            >
              Back to All
            </Button>
          )}
        </div>
        
        <div className="max-w-xs">
          <Input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="Search"
          />
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-display font-semibold mb-4">Create New Folder</h3>
            <Input
              type="text"
              placeholder="Folder name..."
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <Button
                variant="primary"
                onClick={handleCreateFolder}
                disabled={!folderName.trim()}
              >
                Create
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateFolder(false);
                  setFolderName('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Folders Grid */}
      {currentFolders.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentFolders.map((folder) => (
            <motion.div
              key={folder.Id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-4 text-center cursor-pointer hover:bg-primary hover:text-white transition-colors group"
              onClick={() => setCurrentFolder(folder)}
            >
              <ApperIcon name="Folder" className="w-8 h-8 mx-auto mb-2 group-hover:text-white" />
              <h4 className="font-medium text-sm mb-1">{folder.name}</h4>
              <p className="text-xs text-gray-500 group-hover:text-white/80">
                {recipes.filter(r => r.folderId === folder.Id).length} recipes
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFolder(folder.Id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500 rounded"
              >
                <ApperIcon name="Trash2" className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recipes Display */}
      {filteredRecipes.length === 0 ? (
        <Empty
          title={currentFolder ? `No recipes in ${currentFolder.name}` : "No recipes found"}
          description={currentFolder ? "This folder is empty." : "No recipes match your search."}
          actionText={currentFolder ? "Browse All Recipes" : "Clear Search"}
          actionIcon={currentFolder ? "Search" : "RefreshCw"}
          onAction={() => currentFolder ? setCurrentFolder(null) : setSearchTerm('')}
        />
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            {currentFolder ? `Recipes in ${currentFolder.name}` : 'All Recipes'} 
            ({filteredRecipes.length})
          </h3>
          <div className="space-y-3">
            {filteredRecipes.map((recipe) => (
              <div key={recipe.Id} className="card p-4 flex items-center gap-4">
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{recipe.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-1">{recipe.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => handleMoveRecipe(recipe.savedId, e.target.value || null)}
                    value={recipe.folderId || ''}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Root</option>
                    {folders.map(folder => (
                      <option key={folder.Id} value={folder.Id}>
                        {folder.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCollectionManager;