crystal_doc_search_index_callback({"repository_name":"tracer","body":"![Tracer.cr CI](https://img.shields.io/github/workflow/status/wyhaines/tracer.cr/Tracer.cr%20CI?style=for-the-badge&logo=GitHub)\n[![GitHub release](https://img.shields.io/github/release/wyhaines/tracer.cr.svg?style=for-the-badge)](https://github.com/wyhaines/tracer.cr/releases)\n![GitHub commits since latest release (by SemVer)](https://img.shields.io/github/commits-since/wyhaines/tracer.cr/latest?style=for-the-badge)\n\n\n# Tracer.cr\n\n*WARNING: This code is alpha. Details about its interface may change.*\n  \nTracer.cr provides a facility for attaching tracing code to methods in Crystal code.\n\nThis library is a low level tracing interface. It provides a simple api to use to attach functionality to existing code. It is intended to be a building block for constructing higher level functionality - debugging, performance monitoring, or execution auditing, for example.\n\nIt works through a combination of macros, and leveraging the `previous_def` capability to invoke the previously defined version of a method.\n\nThe current version nominally works, but it is missing some key features that are on the short term roadmap:\n\n1. Add support for the `Trace` annotation so that tracing can be managed via annotations.\n2. Add support for dynamically disabling trace code. It would be really nifty if we could do object inheritance chain manipulation in Crystal like one can in Ruby, when leveraging `prepend` for this sort of stuff, but Crystal's compiled nature doesn't make it dynamic in that way, so the plan is to enable dynamic disabling of trace code through a lookup table and simple `if` statements. It will have some impact on performance, even when the trace code is disabled, but the impact should be extremely small.\n\n## Installation\n\n1. Add the dependency to your `shard.yml`:\n\n   ```yaml\n   dependencies:\n     tracer:\n       github: wyhaines/tracer.cr\n   ```\n\n2. Run `shards install`\n\n## Usage\n\n```crystal\nrequire \"tracer\"\n```\n\nTo use the tracer, require the shard. This will define macros to support all other tracing tasks.\n\nThe main macro that is used to establish tracing functions is `trace`. It takes two required arguments, and one optional argument.\n\n`trace(METHOD_NAME, CALLBACK, BLOCK_DEFINITION)`\n\nThe `METHOD_NAME` should be a `String` that is the name of the method that is being traced. The `CALLBACK` can be either a string specifying a method to call both before and after `METHOD_NAME` is called, or a `Proc` that will be invoked both before and after `METHOD_NAME` is called.\n\nA callback method is expected to take five arguments:\n\n```crystal\ndef callback(caller, method_name, phase, method_identifier, method_counter)\n```\n\n* *method_name*: This will contain the name of the method that is being traced.\n* *phase*: This will contain the phase of the tracing. This will be one of `:before` or `:after`, depending on whether the callback is being invoked before the method being traced, or after it.\n* *method_identifier*: This will contain the identifier of the method being traced. This identifier is a combination of the class/module/struct name, and the line/column of the file where the method definition starts. For example: `TestObject__my_method__11X3`\n* *method_counter*: This contains a monotonically increasing number which is a simple count of methods. Each method that is traced increments this counter by one. The count is an unsigned 128-bit integer.\n* *caller*: This will contain `self`, the object that the method is running in.\n\nA simple example of setting up tracing on a method is:\n\n```crystal\ntrace(\"my_method\", \"my_callback\")\n```\n\nThis example will trace the method `my_method` and invoke the callback `my_callback` both before and after the method is called.\n\nCallbacks can also be specified with blocks or Proc \n```crystal\ntrace(\"my_method\", ->() {puts \"Doing tracing stuff\"})\n```\n\n```crystal\ntrace(\"my_method\", ->(method_name : String) {puts \"Tracing #{method_name}\"})\n```\n\n```crystal\ntrace(\"my_method\", ->(\n  method_name : String,\n  phase : Symbol\n) {puts \"Tracing #{method_name} in phase #{phase}\"})\n```\n\n```crystal\ntrace(\"my_method\", ->(\n  method_name : String,\n  phase : Symbol,\n  method_identifier : String\n) {puts \"Tracing #{method_name} in phase #{phase}; unique method identifier is #{method_identifier}\"})\n```\n\n```crystal\ntrace(\"my_method\", ->(\n  method_name : String,\n  phase : Symbol,\n  method_identifier : String,\n  method_counter : U128\n) {puts \"Tracing #{method_name} in phase #{phase}; unique method identifier is #{method_identifier}; method counter is #{method_counter}\"})\n```\n\n```crystal\ntrace(\"my_method\", ->(\n  method_name : String,\n  phase : Symbol,\n  method_identifier : String,\n  method_counter : U128,\n  caller : Object\n) {puts \"Tracing #{method_name} on #{caller} in phase #{phase}; unique method identifier is #{method_identifier}; method counter is #{method_counter}\"}\n```\n\nTracing also accepts a block syntax:\n\n```crystal\ntrace(\"my_method\") do |method_name, phase, method_identifier|\n  EventLogger.log(method_name, phase, method_identifier)\nend\n```\n\nLike the Proc support, the block support works with any number of arguments from zero to five.\n\n## Development\n\nIf you want to help with the development, email me, and fork the repo. Work on your changes in a branch out of your own repo, and when it is ready (with documentation and specs), send me a pull request telling me what you have done, why you have done it, and what you have done to make sure that it works as expected.\n\n## Contributing\n\n1. Fork it (<https://github.com/wyhaines/tracer.cr/fork>)\n2. Create your feature branch (`git checkout -b my-new-feature`)\n3. Commit your changes (`git commit -am 'Add some feature'`)\n4. Push to the branch (`git push origin my-new-feature`)\n5. Create a new Pull Request\n\n## Contributors\n\n- [Kirk Haines](https://github.com/wyhaines) - creator and maintainer\n\n![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wyhaines/tracer.cr?style=for-the-badge)\n![GitHub issues](https://img.shields.io/github/issues/wyhaines/tracer.cr?style=for-the-badge)\n","program":{"html_id":"tracer/toplevel","path":"toplevel.html","kind":"module","full_name":"Top Level Namespace","name":"Top Level Namespace","abstract":false,"superclass":null,"ancestors":[],"locations":[],"repository_name":"tracer","program":true,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[{"html_id":"add_method_hooks(method_name,method_body=\"\",block_def=nil)-macro","name":"add_method_hooks","doc":null,"summary":null,"abstract":false,"args":[{"name":"method_name","doc":null,"default_value":"","external_name":"method_name","restriction":""},{"name":"method_body","doc":null,"default_value":"\"\"","external_name":"method_body","restriction":""},{"name":"block_def","doc":null,"default_value":"nil","external_name":"block_def","restriction":""}],"args_string":"(method_name, method_body = \"\", block_def = nil)","args_html":"(method_name, method_body = <span class=\"s\">&quot;&quot;</span>, block_def = <span class=\"n\">nil</span>)","location":{"filename":"src/tracer.cr","line_number":12,"url":"https://github.com/wyhaines/tracer.cr/blob/16297d46796d39d8e116886b82cc0108ab8fef84/src/tracer.cr#L12"},"def":{"name":"add_method_hooks","args":[{"name":"method_name","doc":null,"default_value":"","external_name":"method_name","restriction":""},{"name":"method_body","doc":null,"default_value":"\"\"","external_name":"method_body","restriction":""},{"name":"block_def","doc":null,"default_value":"nil","external_name":"block_def","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"  \n{% if method_name.includes?(\".\")\n  receiver_name, method_name = method_name.split(\".\")\n  if receiver_name == \"self\"\n    receiver = @type.class\n  else\n    receiver = nil\n    search_paths = [@top_level]\n    unless receiver_name[0..1] == \"::\"\n      search_paths << @type.class\n    end\n    search_paths.each do |search_path|\n      unless receiver\n        found_the_receiver = true\n        parts = receiver_name.split(\"::\")\n        parts.each do |part|\n          if found_the_receiver\n            constant_id = search_path.constants.find do |c|\n              c.id == part\n            end\n            if !constant_id\n              found_the_receiver = false\n            else\n              search_path = search_path.constant(constant_id)\n              if search_path.nil?\n                found_the_receiver = false\n              end\n            end\n          end\n        end\n        if found_the_receiver\n          receiver = search_path.class\n        end\n      end\n    end\n  end\nelse\n  receiver = @type\nend %}\n\n  \n{% methods = receiver ? receiver.methods.select do |m|\n  m.name.id == method_name\nend : [] of Nil %}\n\n  \n{% for method in methods %}\n  {% method_args = method.args\nif method.accepts_block? && method.block_arg\n  block_arg = \"&#{method.block_arg.id}\".id\nelse\n  block_arg = nil\nend\nif block_arg\n  method_args << block_arg\nend\nif block_def\n  method_args << block_def\nend\ntrace_enabled = true\ntrace_method_receiver = \"#{(receiver.id.gsub(/\\.class/, \"\")).gsub(/:Module/, \"\")}\".id\ntrace_method_identifier = \"#{trace_method_receiver}__#{method_name.id}__#{method.line_number.id}X#{method.column_number.id}\"\n %}\n  {{ method.visibility.id == \"public\" ? \"\".id : method.visibility.id }} def {{ receiver == @type ? \"\".id : \"#{(receiver.id.gsub(/\\.class/, \"\")).gsub(/:Module/, \"\")}.\".id }}{{ method.name.id }}{{ !method_args.empty? ? \"(\".id : \"\".id }}{{ (method_args.join(\", \")).id }}{{ !method_args.empty? ? \")\".id : \"\".id }}{{ method.return_type.id != \"\" ? \" : #{method.return_type.id}\".id : \"\".id }}\n    # {{ receiver.id }}\n    __trace_method_receiver__ = {{ trace_method_receiver }}\n    __trace_method_call_counter__ = Tracer::METHOD_COUNTER[0]\n    Tracer::METHOD_COUNTER[0] = Tracer::METHOD_COUNTER[0] &+ 1\n    __trace_method_name__ = {{ method_name }}\n    __trace_method_identifier__ = {{ trace_method_identifier }}\n\n    {{ method_body.is_a?(StringLiteral) ? method_body.id : (method_body.body.id.gsub(/previous_def\\(\\)/, \"previous_def\")).id }}\n  end\n  {% end %}\n\n  \n{% if flag?(:DEBUG)\n  debug\nend %}\n\n\n"}},{"html_id":"trace(method_name,callback,block_def=nil)-macro","name":"trace","doc":null,"summary":null,"abstract":false,"args":[{"name":"method_name","doc":null,"default_value":"","external_name":"method_name","restriction":""},{"name":"callback","doc":null,"default_value":"","external_name":"callback","restriction":""},{"name":"block_def","doc":null,"default_value":"nil","external_name":"block_def","restriction":""}],"args_string":"(method_name, callback, block_def = nil)","args_html":"(method_name, callback, block_def = <span class=\"n\">nil</span>)","location":{"filename":"src/tracer.cr","line_number":86,"url":"https://github.com/wyhaines/tracer.cr/blob/16297d46796d39d8e116886b82cc0108ab8fef84/src/tracer.cr#L86"},"def":{"name":"trace","args":[{"name":"method_name","doc":null,"default_value":"","external_name":"method_name","restriction":""},{"name":"callback","doc":null,"default_value":"","external_name":"callback","restriction":""},{"name":"block_def","doc":null,"default_value":"nil","external_name":"block_def","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":null,"visibility":"Public","body":"  add_method_hooks(\n    \n{{ method_name }}\n,\n    ->() \n{\n      \n{% if callback.is_a?(Block) || callback.is_a?(ProcLiteral) %}\n      {% pre_args = [] of Nil\npost_args = [] of Nil\ncallback_arity = callback.args.size\nif callback_arity > 0\n  pre_args << method_name.stringify\n  post_args << method_name.stringify\nend\nif callback_arity > 1\n  pre_args << \":before\".id\n  post_args << \":after\".id\nend\nif callback_arity > 2\n  pre_args << \"__trace_method_identifier__\".id\n  post_args << \"__trace_method_identifier__\".id\nend\nif callback_arity > 3\n  pre_args << \"__trace_method_call_counter__\".id\n  post_args << \"__trace_method_call_counter__\".id\nend\nif callback_arity > 4\n  pre_args << \"self\".id\n  post_args << \"self\".id\nend\n %}\n      begin\n        {{ callback.id }}.call({{ (pre_args.join(\", \")).id }})\n        previous_def\n      ensure\n        {{ callback.id }}.call({{ (post_args.join(\", \")).id }})\n      end\n      {% else %}\n      begin\n        {{ callback.id }}({{ method_name }}, :before, __trace_method_identifier__, __trace_method_call_counter__, self)\n        previous_def\n      ensure\n        {{ callback.id }}({{ method_name }}, :after, __trace_method_identifier__, __trace_method_call_counter__, self)\n      end\n      {% end %}\n\n    },\n    \n{{ block_def }}\n\n  )\n  \n{% if flag?(:DEBUG)\n  debug\nend %}\n\n\n\n"}},{"html_id":"trace(method_name,block_def=nil,&callback)-macro","name":"trace","doc":null,"summary":null,"abstract":false,"args":[{"name":"method_name","doc":null,"default_value":"","external_name":"method_name","restriction":""},{"name":"block_def","doc":null,"default_value":"nil","external_name":"block_def","restriction":""}],"args_string":"(method_name, block_def = nil, &callback)","args_html":"(method_name, block_def = <span class=\"n\">nil</span>, &callback)","location":{"filename":"src/tracer.cr","line_number":138,"url":"https://github.com/wyhaines/tracer.cr/blob/16297d46796d39d8e116886b82cc0108ab8fef84/src/tracer.cr#L138"},"def":{"name":"trace","args":[{"name":"method_name","doc":null,"default_value":"","external_name":"method_name","restriction":""},{"name":"block_def","doc":null,"default_value":"nil","external_name":"block_def","restriction":""}],"double_splat":null,"splat_index":null,"block_arg":{"name":"callback","doc":null,"default_value":"","external_name":"callback","restriction":""},"visibility":"Public","body":"  add_method_hooks(\n    \n{{ method_name }}\n,\n    ->() \n{\n      \n{% pre_args = [] of Nil\npost_args = [] of Nil\narg_types = [] of Nil\ncallback_arity = callback.args.size\nif callback_arity > 0\n  pre_args << method_name.stringify\n  post_args << method_name.stringify\n  arg_types << \"#{callback.args[0].id} : String\"\nend\nif callback_arity > 1\n  pre_args << \":before\".id\n  post_args << \":after\".id\n  arg_types << \"#{callback.args[1].id} : Symbol\"\nend\nif callback_arity > 2\n  pre_args << \"__trace_method_identifier__\".id\n  post_args << \"__trace_method_identifier__\".id\n  arg_types << \"#{callback.args[2].id} : String\"\nend\nif callback_arity > 3\n  pre_args << \"__trace_method_call_counter__\".id\n  post_args << \"__trace_method_call_counter__\".id\n  arg_types << \"#{callback.args[3].id} : UInt128\"\nend\nif callback_arity > 4\n  if method_name.includes?(\".\")\n    receiver_name, method_name = method_name.split(\".\")\n    if receiver_name == \"self\"\n      receiver = @type.class\n    else\n      receiver = nil\n      search_paths = [@top_level]\n      unless receiver_name[0..1] == \"::\"\n        search_paths << @type.class\n      end\n      search_paths.each do |search_path|\n        unless receiver\n          found_the_receiver = true\n          parts = receiver_name.split(\"::\")\n          parts.each do |part|\n            if found_the_receiver\n              constant_id = search_path.constants.find do |c|\n                c.id == part\n              end\n              if !constant_id\n                found_the_receiver = false\n              else\n                search_path = search_path.constant(constant_id)\n                if search_path.nil?\n                  found_the_receiver = false\n                end\n              end\n            end\n          end\n          if found_the_receiver\n            receiver = search_path.class\n          end\n        end\n      end\n    end\n  else\n    receiver = @type\n  end\n  pre_args << \"self\".id\n  post_args << \"self\".id\n  arg_types << \"#{callback.args[4].id} : #{receiver.id}\".id\nend\n %}\n\n      begin\n        ->(\n{{ (arg_types.join(\", \")).id }}\n) do\n          \n{{ callback.body.id }}\n\n        \nend.call(\n{{ (pre_args.join(\", \")).id }}\n)\n        previous_def\n      \nensure\n        ->(\n{{ (arg_types.join(\", \")).id }}\n) do\n          \n{{ callback.body.id }}\n\n        \nend.call(\n{{ (post_args.join(\", \")).id }}\n)\n      \nend\n    },\n    \n{{ block_def }}\n\n  )\n  \n{% if flag?(:DEBUG)\n  debug\nend %}\n\n\n\n"}}],"types":[{"html_id":"tracer/Trace","path":"Trace.html","kind":"annotation","full_name":"Trace","name":"Trace","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/tracer.cr","line_number":9,"url":"https://github.com/wyhaines/tracer.cr/blob/16297d46796d39d8e116886b82cc0108ab8fef84/src/tracer.cr#L9"}],"repository_name":"tracer","program":false,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":"This annotation will be used to support annotation based trace management.\nThis feature hasn't been built yet.","summary":"<p>This annotation will be used to support annotation based trace management.</p>","class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]},{"html_id":"tracer/Tracer","path":"Tracer.html","kind":"module","full_name":"Tracer","name":"Tracer","abstract":false,"superclass":null,"ancestors":[],"locations":[{"filename":"src/tracer.cr","line_number":1,"url":"https://github.com/wyhaines/tracer.cr/blob/16297d46796d39d8e116886b82cc0108ab8fef84/src/tracer.cr#L1"}],"repository_name":"tracer","program":false,"enum":false,"alias":false,"aliased":null,"aliased_html":null,"const":false,"constants":[{"id":"METHOD_COUNTER","name":"METHOD_COUNTER","value":"[0_u128]","doc":null,"summary":null},{"id":"VERSION","name":"VERSION","value":"\"0.1.0\"","doc":null,"summary":null}],"included_modules":[],"extended_modules":[],"subclasses":[],"including_types":[],"namespace":null,"doc":null,"summary":null,"class_methods":[],"constructors":[],"instance_methods":[],"macros":[],"types":[]}]}})