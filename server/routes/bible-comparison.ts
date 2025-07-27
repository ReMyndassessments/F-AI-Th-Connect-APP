// Test route to compare different Bible API implementations
import { Router } from 'express';
import { bibleAPI } from '../services/bible-api.js';
import { simpleBibleAPI } from '../services/simple-bible-api.js';

const router = Router();

// Compare different Bible API services
router.get('/compare/:reference', async (req, res) => {
  const reference = req.params.reference;
  
  try {
    const [currentAPIResult, simpleBibleResult] = await Promise.all([
      bibleAPI.getVerse(reference).catch(e => ({ error: e.message })),
      simpleBibleAPI.getVerse(reference).catch(e => ({ error: e.message }))
    ]);

    res.json({
      reference,
      comparison: {
        currentAPI: {
          service: 'API.Bible (with API key)',
          result: currentAPIResult
        },
        simpleBibleAPI: {
          service: 'bible-api.com (free, no key)',
          result: simpleBibleResult
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to compare APIs' });
  }
});

// Test simple Bible API specifically
router.get('/simple/:reference', async (req, res) => {
  const reference = req.params.reference;
  
  try {
    const result = await simpleBibleAPI.getVerse(reference);
    res.json({ reference, result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch verse' });
  }
});

export default router;