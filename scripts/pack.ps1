#pack exrension

Copy-Item .\_locales\* .\dist\_locales -Force -Recurse
Copy-Item .\config\manifest.json .\dist\manifest.json -Force