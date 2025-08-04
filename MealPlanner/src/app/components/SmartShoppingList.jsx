import React, { useState } from 'react';
import { ShoppingCart, Plus, Check, X } from 'lucide-react';

const SmartShoppingList = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Garlic', quantity: '2 cloves', category: 'produce', fromRecipe: 'Creamy Chicken Rice Bowl', purchased: false },
    { id: '2', name: 'Onion', quantity: '1 medium', category: 'produce', fromRecipe: 'Creamy Chicken Rice Bowl', purchased: false },
    { id: '3', name: 'Parmesan Cheese', quantity: '100g', category: 'dairy', fromRecipe: 'Creamy Chicken Rice Bowl', purchased: false },
    { id: '4', name: 'Bread', quantity: '1 loaf', category: 'bakery', purchased: true },
  ]);

  const togglePurchased = (id) => {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((items) => items.filter((item) => item.id !== id));
  };

  const pendingItems = items.filter((item) => !item.purchased);
  const purchasedItems = items.filter((item) => item.purchased);

  const getCategoryColor = (category) => {
    const colors = {
      produce: { background: '#d1fae5', color: '#065f46' },
      dairy: { background: '#dbeafe', color: '#1e40af' },
      bakery: { background: '#ffedd5', color: '#c2410c' },
      meat: { background: '#fee2e2', color: '#991b1b' },
    };
    return colors[category] || { background: '#e5e7eb', color: '#374151' };
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <ShoppingCart size={20} style={{ marginRight: 8 }} />
            <Typography variant="h6">Smart Shopping List</Typography>
          </Box>
        }
        action={
          <Chip
            label={`${pendingItems.length} items needed`}
            variant="outlined"
            color="default"
          />
        }
      />
      <CardContent>
        <Stack spacing={3}>
          {pendingItems.length > 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Need to Buy
              </Typography>
              <Stack spacing={2}>
                {pendingItems.map((item) => {
                  const colorStyle = getCategoryColor(item.category);
                  return (
                    <Box
                      key={item.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      sx={{
                        backgroundColor: '#f9fafb',
                        borderRadius: 2,
                        '&:hover': { backgroundColor: '#f3f4f6' },
                      }}
                    >
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              bgcolor: colorStyle.background,
                              color: colorStyle.color,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity}
                        </Typography>
                        {item.fromRecipe && (
                          <Typography variant="caption" color="primary">
                            For: {item.fromRecipe}
                          </Typography>
                        )}
                      </Box>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => togglePurchased(item.id)}
                          color="success"
                        >
                          <Check size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          color="error"
                        >
                          <X size={16} />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          {purchasedItems.length > 0 && (
            <Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Purchased
              </Typography>
              <Stack spacing={2}>
                {purchasedItems.map((item) => {
                  const colorStyle = getCategoryColor(item.category);
                  return (
                    <Box
                      key={item.id}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      p={2}
                      sx={{
                        backgroundColor: '#ecfdf5',
                        borderRadius: 2,
                        opacity: 0.75,
                      }}
                    >
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography
                            variant="subtitle2"
                            sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                          >
                            {item.name}
                          </Typography>
                          <Chip
                            label={item.category}
                            size="small"
                            sx={{
                              bgcolor: colorStyle.background,
                              color: colorStyle.color,
                              fontWeight: 500,
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.quantity}
                        </Typography>
                      </Box>
                      <Button size="small" onClick={() => togglePurchased(item.id)}>
                        Undo
                      </Button>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          )}

          <Divider />

          <Box display="flex" gap={2} pt={2}>
            <Button variant="outlined" fullWidth startIcon={<Plus size={16} />}>
              Add Item
            </Button>
            <Button variant="contained" color="success" fullWidth>
              Share List
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SmartShoppingList;
