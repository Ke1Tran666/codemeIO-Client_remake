import { Star, Check, Award, Clock, BarChart } from 'lucide-react';

const ClientProduct = () => {
    return (
        <main className="container mx-auto">
            <div className="max-w-[1320px] w-full mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h1 className="text-3xl font-bold mb-4">Complete React Developer in 2024: Zero to Mastery</h1>
                        <p className="text-xl mb-4">Become a Senior React Developer. Build a massive E-commerce app with Redux, Hooks, GraphQL, Stripe, Firebase</p>
                        <div className="flex items-center mb-4">
                            <div className="flex items-center mr-4">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} className="w-5 h-5 text-yellow-400 mr-1" />
                                ))}
                            </div>
                            <span className="text-lg font-semibold">4.7</span>
                            <span className="text-muted-foreground ml-2">(18,373 ratings)</span>
                            <span className="text-muted-foreground ml-4">62,470 students</span>
                        </div>
                        <div className="flex items-center mb-6">
                            <img src="https://images.unsplash.com/photo-1520694478166-daaaaec95b69?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Instructor" className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <p className="font-semibold">Created by Andrei Neagoie, Yihua Zhang</p>
                                <p className="text-muted-foreground">Last updated 3/2024</p>
                            </div>
                        </div>
                        <div className="border rounded-lg p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-4">What you&apos;ll learn</h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {[
                                    "Build enterprise level React applications and deploy to production",
                                    "Learn to build reactive, performant, large scale applications like a senior developer",
                                    "Learn the latest features in React including Hooks, Context API, Suspense, React Lazy + more",
                                    "Master the latest ecosystem of a React Developer from scratch"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <Check className="w-5 h-5 mr-2 mt-1 flex-shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <h2 className="text-2xl font-semibold mb-4">Course content</h2>
                        <div className="mb-8">
                            <p className="mb-2">37 sections • 422 lectures • 47h 3m total length</p>
                            {/* Add course content sections here */}
                        </div>
                        <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                        <ul className="list-disc pl-5 mb-8">
                            <li>Basic HTML, CSS and JavaScript knowledge</li>
                            <li>A computer with access to the internet</li>
                            <li>Eagerness to learn and become a React developer!</li>
                        </ul>
                        <h2 className="text-2xl font-semibold mb-4">Description</h2>
                        <p className="mb-4">
                            Just updated with all new React features for 2024 (React 18)! Join a live online community of over 600,000+ developers and a course taught by industry experts that have actually worked both in Silicon Valley and Toronto with React.js.
                        </p>
                        <p className="mb-4">
                            Using the latest version of React (React 18), this course is focused on efficiency. Never spend time on confusing, out of date, incomplete tutorials anymore. Graduates of Andrei&apos;s courses are now working at Google, Tesla, Amazon, Apple, IBM, JP Morgan, Facebook, + other top tech companies.
                        </p>
                        {/* Add more description paragraphs here */}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="border rounded-lg p-6 sticky top-4 bg-white">
                            <div className="mb-4">
                                <span className="text-3xl font-bold">$94.99</span>
                                <span className="line-through text-muted-foreground ml-2">$199.99</span>
                            </div>
                            <button className="w-full mb-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">Buy now</button>
                            <p className="text-center text-sm mb-4">30-Day Money-Back Guarantee</p>
                            <div className="space-y-2">
                                {[
                                    { Icon: Clock, text: "47 hours on-demand video" },
                                    { Icon: BarChart, text: "69 coding exercises" },
                                    { Icon: Award, text: "Certificate of completion" }
                                ].map(({ Icon, text }, index) => (
                                    <div key={index} className="flex items-center">
                                        <Icon className="w-5 h-5 mr-2" />
                                        <span>{text}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Add related image here */}
                            <img src="https://plus.unsplash.com/premium_photo-1685086785636-2a1a0e5b591f?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Related course material" className="mt-4 mb-4 rounded" />
                        </div>
                    </div>
                </div>
                {/* Comments Section moved outside payment section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-2">Comments</h2>
                    <textarea
                        className="w-full p-2 border rounded mb-2"
                        rows="4"
                        placeholder="Leave a comment..."
                    />
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded">Submit</button>
                    {/* Add existing comments here if needed */}
                </div>
            </div>
        </main>
    );
};

export default ClientProduct;
