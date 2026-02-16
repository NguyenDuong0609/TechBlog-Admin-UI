import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding started...')

    // Clean existing data
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
    await prisma.category.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.user.deleteMany()

    // 1. Create Users
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@blog.com',
            role: 'admin',
        },
    })

    const editor = await prisma.user.create({
        data: {
            name: 'Editor Jane',
            email: 'jane@blog.com',
            role: 'editor',
        },
    })

    // 2. Create Categories
    const techCategory = await prisma.category.create({
        data: {
            name: 'Technology',
            slug: 'technology',
            description: 'Tech articles and tutorials',
        },
    })

    const devCategory = await prisma.category.create({
        data: {
            name: 'Development',
            slug: 'development',
            description: 'Software development posts',
        },
    })

    const devopsCategory = await prisma.category.create({
        data: {
            name: 'DevOps',
            slug: 'devops',
            description: 'Infrastructure and automation',
        },
    })

    // 3. Create Tags
    const reactTag = await prisma.tag.create({
        data: { name: 'React', slug: 'react' },
    })
    const nextjsTag = await prisma.tag.create({
        data: { name: 'Next.js', slug: 'nextjs' },
    })
    const tailwindTag = await prisma.tag.create({
        data: { name: 'Tailwind', slug: 'tailwind' },
    })
    const k8sTag = await prisma.tag.create({
        data: { name: 'Kubernetes', slug: 'kubernetes' },
    })

    // 4. Create sample posts
    for (let i = 1; i <= 15; i++) {
        const isPublished = i % 3 === 0
        const status = isPublished ? 'published' : 'draft'

        await prisma.post.create({
            data: {
                title: `Post Title ${i}: Mastering ${i % 2 === 0 ? 'Frontend' : 'Backend'}`,
                slug: `post-mastering-${i % 2 === 0 ? 'frontend' : 'backend'}-${i}`,
                content: `This is the content for post ${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
                excerpt: `A brief description of post ${i} focusing on technical excellence.`,
                status: status,
                published: isPublished,
                publishedAt: isPublished ? new Date() : null,
                categoryId: i % 3 === 0 ? devopsCategory.id : (i % 2 === 0 ? techCategory.id : devCategory.id),
                authorId: i % 2 === 0 ? admin.id : editor.id,
                views: Math.floor(Math.random() * 1000),
                reads: Math.floor(Math.random() * 500),
                readRate: Math.random() * 100,
                metaTitle: `SEO Title for Post ${i}`,
                metaDescription: `Discover how to master ${i % 2 === 0 ? 'Frontend' : 'Backend'} development in this comprehensive guide.`,
                tags: {
                    connect: [
                        { id: reactTag.id },
                        { id: i % 2 === 0 ? nextjsTag.id : k8sTag.id },
                    ],
                },
                comments: {
                    create: [
                        {
                            content: `Great insights on ${i % 2 === 0 ? 'Frontend' : 'Backend'} techniques!`,
                            authorId: i % 2 === 0 ? editor.id : admin.id,
                        }
                    ]
                }
            },
        })
    }

    console.log('Database seeded successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
