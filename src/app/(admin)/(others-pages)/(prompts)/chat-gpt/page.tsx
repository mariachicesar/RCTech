"use client";
import { useState } from "react";
import ComponentCard from "../../../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../../../components/common/PageBreadCrumb";
import Input from "../../../../../components/form/input/InputField";
import Label from "../../../../../components/form/Label";
import Link from "next/link";

const ChatGPTPage = () => {
    const [formData, setFormData] = useState({
        ourUrl: "",
        city: "",
        industry: "",
        keyword: "",
        competitor1Url: "",
        competitor2Url: "",
        service: "",
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    return (
        <div>
            <PageBreadcrumb pageTitle="Prompts" />
            <ComponentCard title="Ask ChatGPT">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <form className="space-y-6 gap-2 grid grid-cols-1 xl:grid-cols-2">
                        <div>
                            <Label>Our Url</Label>
                            <Input type="text" name="ourUrl" value={formData.ourUrl} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>City</Label>
                            <Input type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Industry</Label>
                            <Input type="text" name="industry" value={formData.industry} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Keyword</Label>
                            <Input type="text" name="keyword" value={formData.keyword} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Competitor #1 Url</Label>
                            <Input type="text" name="competitor1Url" value={formData.competitor1Url} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Competitor #2 Url</Label>
                            <Input type="text" name="competitor2Url" value={formData.competitor2Url} onChange={handleChange} />
                        </div>
                        <div>
                            <Label>Service</Label>
                            <Input type="text" name="service" value={formData.service} onChange={handleChange} />
                        </div>
                    </form>
                    <div>
                        <ul>
                            <li className="text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Note:</span> This is a demo page to show how to use the ChatGPT.
                            </li>
                            <li className="text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Tip:</span> Google competitor by Industry, City, and Keyword to find relevant competitors.
                            </li>
                            <li className="text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Tip:</span> Paste it to <Link href="https://www.spyfu.com/" className="underline text-blue-600">https://www.spyfu.com/</Link> Get top Performance and use their URL as Competitor
                            </li>
                            <li className="text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Tip:</span> Find Questions and Answers for Blogs
                                <Link href="https://answerthepublic.com/" className="underline text-blue-600">https://answerthepublic.com/</Link>
                                <span className="text-gray-500 dark:text-gray-400"> to get ideas for your content. Add Keyword and get blog idea</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </ComponentCard>

            <ComponentCard title="SEO & Content ChatGPT Prompts" className="mt-6">
                <div className="space-y-8">
                    {/* Ideas */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Ideas Creation</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">4. Blog Post Ideas</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Based on my niche {formData.industry} and ideal customer give me 10 blog post ideas that would actually attract traffic and help build topical authority</p>
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">17. Buyer Journey Content</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Give me 3 blog post ideas for each stage of the buyer journey (top, middle, bottom) based on the topic {formData.keyword}. These should attract, educate, and convert readers over time.</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">8. Competitor Analysis</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Here&apos;s a competitor&apos;s blog post: {formData.competitor2Url} What are they doing well, what could be improved, and how can I write something better that ranks?</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">12. Local Content Ideas</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">What are some blog post or service page ideas I could create to rank locally for {formData.industry} in {formData.city}? Make it hyper-local and include potential headlines.</p>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">16. Content Outline</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Using the top 3 results for {formData.keyword} write me an outline using all of the heading tags from those pages. Remove any duplicates and irrelevant tags</p>
                        </div>
                    </div>
                    {/* Blog Content Creation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Blog Content Creation</h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Hints:</span> Base on outcome give me an entire page content that includes seo title, metadata description, keywords, slug in Markdown Format </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Hints:</span> Base on outcome give me an entire page content that includes seo title, metadata description, keywords, slug in Markdown Format. Make them click-worthy with a clear benefit. </p>

                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">1. Unique Blog Post Questions in Industry</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Ask me any questions you&apos;d need in order to write a truly unique blog post using my personal experience in {formData.industry}, opinions, customer stories, and real-world examples that no one else could replicate</p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Next: Answer the questions</p>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt: Now with the above write me a unique blog using the best seo practices</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. SEO Blog from Transcript</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Using this transcript write a helpful SEO-optimized blog post that keeps my tone and includes an intro, key takeaways at the top, headings, and a clear CTA. The main keyword is {formData.keyword}. Use this competitor as example {formData.competitor1Url}</p>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">20. Keyword Analysis</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Paste:</span> How many times does {formData.keyword} or variations appear on {formData.competitor1Url}. How many times does {formData.city} appear. How many heading tags use either? </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Paste:</span> How many times does {formData.keyword} or variations appear on {formData.competitor2Url}. How many times does {formData.city} appear. How many heading tags use either? </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">Paste:</span> Now with the above information, write me a blog for my site {formData.ourUrl} in {formData.city}.</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">13. Service Page Creation</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Help me write an SEO optimized service page for {formData.keyword} in {formData.city}. Ask many questions about my unique process, testimonials, pricing, and past client results first.</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">9. FAQ Section</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Based on this blog post {formData.ourUrl} write an SEO-optimized FAQ section using questions real people are asking in Google (People Also Ask, Reddit, and Quora). Keep answers concise and conversational using my expertise and personal experience.</p>
                            </div>
                        </div>
                    </div>

                    {/* SEO Optimization */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">SEO Optimization</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">2. Internal Linking Opportunities</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Give me a list of internal linking opportunities for this page {formData.ourUrl} by scanning my sitemap: [our/sitemap.xml]</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">5. Title Tag Variations</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Write 5 SEO-friendly title tag variations for this blog post: {formData.ourUrl} Make them compelling, use the main keyword towards the beginning and keep them under 60 characters.</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">10. SEO Metadata</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Write SEO metadata for following blog {formData.ourUrl}. Following best SEO practices for title, description, slug, and keywords. Make them click-worthy with a clear benefit.</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">14. Schema Markup</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Generate schema markup for this blog post {formData.ourUrl}. Include FAQ schema too based on the content</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">15. SEO Audit</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">I want this page to rank: {formData.ourUrl} Give me an SEO audit covering headings, internal links, keyword usage, readability, and suggestions for improvement. The main keyword is {formData.keyword}</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">11. Content Gaps</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Based on my site: {formData.ourUrl} and these competitors: {formData.competitor1Url}, {formData.competitor2Url} what content gaps do I have that I should fill to boost SEO?</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">18. Website Comparison</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Compare my website {formData.ourUrl} to this competitor: {formData.competitor2Url} Tell me what they&apos;re doing better from an SEO/content perspective and what I should do to catch up or stand out.</p>
                            </div>
                        </div>
                    </div>

                    {/* Social Media Repurposing */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Social Media Repurposing</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">6. Carousel Post</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Take this blog post {formData.ourUrl} and repurpose it into a carousel post for Instagram and Facebook.</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">7. Reel Script</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Using this blog post {formData.ourUrl}, write me a script for a reel. Give me 5 options for hooks. I only have an iPhone and will use a free app to edit it.</p>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Content Strategy */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Advanced Content Strategy</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">19. Backlink Content</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Suggest 5 content ideas I could create that naturally attract backlinks in my niche. Think tools, data studies, templates, or free resources people would want to link to.</p>
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Link Building Notes</h3>
                        <div className="space-y-3">
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">21. Guest Post Strategy</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">TODO: Go to Google [industry] intitle:&quot;write for us&quot; and email all to get backlinks</p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">22. Authority Targets</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Authority and Ref Domain should be around 10</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ComponentCard>

        </div>

    );
};

export default ChatGPTPage;
