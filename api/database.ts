import { getMasterDocument } from './_lib/mongodb';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { doc, collection } = await getMasterDocument();

    if (req.method === 'GET') {
      return res.status(200).json({
        users: doc.users || [],
        admins: doc.admins || [],
        records: doc.records || []
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      await collection.updateOne(
        { _id: doc._id },
        { 
          $set: { 
            users: body.users || doc.users,
            admins: body.admins || doc.admins,
            records: body.records || doc.records
          } 
        },
        { upsert: true }
      );

      const updatedDoc = await collection.findOne({ _id: doc._id });
      return res.status(200).json({
        success: true,
        users: updatedDoc?.users || body.users,
        admins: updatedDoc?.admins || body.admins,
        records: updatedDoc?.records || body.records
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error in database handler:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
