import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Card, 
  CardContent,
  CircularProgress,
  Chip,
  Stack
} from '@mui/material';
import { Search, Lightbulb } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_APP_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });

const SmartSubstitutions = () => {
  const [ingredient, setIngredient] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [substitutions, setSubstitutions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Hardcoded user preferences (will come from user collection in DB)
  const allergies = ['Dairy', 'Nuts'];
  const dietaryPrefs = ['Vegetarian'];

  const getSubstitutions = async () => {
    if (!ingredient.trim()) return;
    
    setLoading(true);
    try {
      const allergyText = allergies.length > 0 ? `AVOID ingredients containing: ${allergies.join(', ')}. ` : '';
      const dietaryText = dietaryPrefs.length > 0 ? `Must be suitable for: ${dietaryPrefs.join(', ')} diet. ` : '';
      
      const prompt = `Suggest 3-4 practical and healthy substitutes for "${ingredient}" in a ${recipeName || 'general'} recipe. 
      ${allergyText}${dietaryText}
      For each substitute, provide:
      1. The substitute ingredient
      2. The conversion ratio
      3. Brief reason why it works
      
      Format as JSON array:
      [{"substitute": "ingredient name", "ratio": "conversion", "reason": "why it works"}]`;

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      
      const cleanedResponse = response.replace(/```json|```/g, '').trim();
      const parsedSubstitutions = JSON.parse(cleanedResponse);
      
      setSubstitutions(parsedSubstitutions);
    } catch (error) {
      console.error('Error getting substitutions:', error);
      setSubstitutions([{
        substitute: "Unable to get substitutions",
        ratio: "Try again",
        reason: "Please check your connection and try again"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Lightbulb size={24} color="#4CAF50" />
          <Typography variant="h6" fontWeight="bold">
            Smart Recipe Substitutions
          </Typography>
        </Box>

        <Stack spacing={2} mb={3}>
          <TextField
            fullWidth
            label="Missing Ingredient"
            placeholder="e.g., heavy cream, eggs, butter"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
          />
          <TextField
            fullWidth
            label="Recipe Name (Optional)"
            placeholder="e.g., pasta sauce, cake, soup"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
          />
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Your Profile: 
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {allergies.map((allergy) => (
                <Chip key={allergy} label={`Allergic to ${allergy}`} size="small" color="error" />
              ))}
              {dietaryPrefs.map((pref) => (
                <Chip key={pref} label={pref} size="small" color="success" />
              ))}
            </Stack>
          </Box>
          <Button
            variant="contained"
            onClick={getSubstitutions}
            disabled={loading || !ingredient.trim()}
            startIcon={loading ? <CircularProgress size={16} /> : <Search size={16} />}
            sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#45a049' } }}
          >
            {loading ? 'Finding Substitutes...' : 'Get Substitutions'}
          </Button>
        </Stack>

        {substitutions.length > 0 && (
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>
              Suggested Substitutes:
            </Typography>
            <Stack spacing={2}>
              {substitutions.map((sub, index) => (
                <Card key={index} variant="outlined" sx={{ bgcolor: '#f8f9fa' }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Chip 
                        label={sub.substitute} 
                        color="primary" 
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {sub.ratio}
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      {sub.reason}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartSubstitutions;