import os

path = 'src/components/workforce/WorkforceIntelligenceView.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

search_block = """                      {result.trendingRoles.map((role) => (
                        <span
                          key={role}
                          className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>"""

replace_block = """                      {result.trendingRoles.map((role) => (
                        <span
                          key={role}
                          className="text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 📊 SAS-Style Market Analytics Dashboard */}
                {result.analyticsData && (
                  <div className="mt-8">
                    <MarketAnalyticsDashboard data={result.analyticsData} />
                  </div>
                )}"""

content = content.replace(search_block, replace_block)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
