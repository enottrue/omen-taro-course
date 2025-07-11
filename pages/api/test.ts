import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('✅ Test endpoint reached');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  
  res.status(200).json({ 
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString(),
    method: req.method
  });
} 