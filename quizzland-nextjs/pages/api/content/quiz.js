const API_URL = process.env.NEXT_PUBLIC_API_URL

export default async (req, res) => {
    if (req.method === 'GET') {
        try {
            const apiRes = await fetch(`${API_URL}/api/content/quiz/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: body
            })

            const data = await apiRes.json()

            if (apiRes.status === 201) {
                return res.status(201).json({ success: data.success })
            } else {
                return res.status(apiRes.status).json({
                    error: data.error
                })
            }

        } catch (error) {
            return res.status(500).json({
                'error': 'Somthing went wrong when registering for an account'
            })
        }

    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({'error': `Method ${req.method} not allowed`});
    }
}