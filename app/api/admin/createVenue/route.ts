export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get('name');
  // try {
  // const authHeader = request.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];
  // const decoded: any = jwt.verify(token, JWT_SECRET);
  // const { data, error } = await supabase.from('venue').insert([
  //   {
  //     name: locationPayload,
  //   },
  // ]);
  // if (error) {
  //   res.status(500).json({ error });
  // } else {
  //   res.json({ data });
  // }
  // } catch (err) {
  //   res.status(403).json({ error: 'Not authorized as an admin' });
  // }
}
