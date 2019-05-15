'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">google-gax documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="contributing.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CONTRIBUTING
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="dependencies.html" data-type="chapter-link">
                                <span class="icon ion-ios-list"></span>Dependencies
                            </a>
                        </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/BundleApiCaller.html" data-type="entity-link">BundleApiCaller</a>
                            </li>
                            <li class="link">
                                <a href="classes/BundleDescriptor.html" data-type="entity-link">BundleDescriptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/BundleExecutor.html" data-type="entity-link">BundleExecutor</a>
                            </li>
                            <li class="link">
                                <a href="classes/CallSettings.html" data-type="entity-link">CallSettings</a>
                            </li>
                            <li class="link">
                                <a href="classes/ClientStub.html" data-type="entity-link">ClientStub</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoogleError.html" data-type="entity-link">GoogleError</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoogleProtoFilesRoot.html" data-type="entity-link">GoogleProtoFilesRoot</a>
                            </li>
                            <li class="link">
                                <a href="classes/GrpcClient.html" data-type="entity-link">GrpcClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/LongrunningApiCaller.html" data-type="entity-link">LongrunningApiCaller</a>
                            </li>
                            <li class="link">
                                <a href="classes/LongRunningDescriptor.html" data-type="entity-link">LongRunningDescriptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/NormalApiCaller.html" data-type="entity-link">NormalApiCaller</a>
                            </li>
                            <li class="link">
                                <a href="classes/OngoingCall.html" data-type="entity-link">OngoingCall</a>
                            </li>
                            <li class="link">
                                <a href="classes/OngoingCallPromise.html" data-type="entity-link">OngoingCallPromise</a>
                            </li>
                            <li class="link">
                                <a href="classes/Operation.html" data-type="entity-link">Operation</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationsClient.html" data-type="entity-link">OperationsClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/OperationsClientBuilder.html" data-type="entity-link">OperationsClientBuilder</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedApiCaller.html" data-type="entity-link">PagedApiCaller</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageDescriptor.html" data-type="entity-link">PageDescriptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/PathTemplate.html" data-type="entity-link">PathTemplate</a>
                            </li>
                            <li class="link">
                                <a href="classes/RetryOptions.html" data-type="entity-link">RetryOptions</a>
                            </li>
                            <li class="link">
                                <a href="classes/StreamDescriptor.html" data-type="entity-link">StreamDescriptor</a>
                            </li>
                            <li class="link">
                                <a href="classes/StreamingApiCaller.html" data-type="entity-link">StreamingApiCaller</a>
                            </li>
                            <li class="link">
                                <a href="classes/StreamProxy.html" data-type="entity-link">StreamProxy</a>
                            </li>
                            <li class="link">
                                <a href="classes/Task.html" data-type="entity-link">Task</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AnyDecoder.html" data-type="entity-link">AnyDecoder</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/APICaller.html" data-type="entity-link">APICaller</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiCallerSettings.html" data-type="entity-link">ApiCallerSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BackoffSettings.html" data-type="entity-link">BackoffSettings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Bindings.html" data-type="entity-link">Bindings</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BundleOptions.html" data-type="entity-link">BundleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BundlingConfig.html" data-type="entity-link">BundlingConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CallOptions.html" data-type="entity-link">CallOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CancellablePromise.html" data-type="entity-link">CancellablePromise</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClientConfig.html" data-type="entity-link">ClientConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClientStubOptions.html" data-type="entity-link">ClientStubOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Descriptor.html" data-type="entity-link">Descriptor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Duplexify.html" data-type="entity-link">Duplexify</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DuplexifyConstructor.html" data-type="entity-link">DuplexifyConstructor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DuplexifyOptions.html" data-type="entity-link">DuplexifyOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GaxCall.html" data-type="entity-link">GaxCall</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GaxCallPromise.html" data-type="entity-link">GaxCallPromise</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GaxCallStream.html" data-type="entity-link">GaxCallStream</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetOperationCallback.html" data-type="entity-link">GetOperationCallback</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GRPCCallOtherArgs.html" data-type="entity-link">GRPCCallOtherArgs</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GRPCCallResult.html" data-type="entity-link">GRPCCallResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GrpcClientOptions.html" data-type="entity-link">GrpcClientOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Metadata.html" data-type="entity-link">Metadata</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MetadataValue.html" data-type="entity-link">MetadataValue</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MethodConfig.html" data-type="entity-link">MethodConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/OperationsClientOptions.html" data-type="entity-link">OperationsClientOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ParseResult.html" data-type="entity-link">ParseResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestType.html" data-type="entity-link">RequestType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RetryParamsConfig.html" data-type="entity-link">RetryParamsConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Segment.html" data-type="entity-link">Segment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServiceConfig.html" data-type="entity-link">ServiceConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SimpleCallbackFunction.html" data-type="entity-link">SimpleCallbackFunction</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubResponseInfo.html" data-type="entity-link">SubResponseInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskCallback.html" data-type="entity-link">TaskCallback</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskData.html" data-type="entity-link">TaskData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskElement.html" data-type="entity-link">TaskElement</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse" ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});