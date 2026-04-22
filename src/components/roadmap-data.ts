/**
 * Data model for the visual roadmap tree on the homepage.
 * `available` nodes link to published pages. `soon` nodes render as coming-soon with a tooltip.
 */

export type NodeStatus = 'available' | 'soon';

export interface RoadmapNode {
	id: string;
	label: string;
	description: string;
	status: NodeStatus;
	href?: string;
}

export interface RoadmapCluster {
	id: string;
	label: string;
	caption: string;
	nodes: RoadmapNode[];
}

export const roadmapClusters: RoadmapCluster[] = [
	{
		id: 'core',
		label: 'Core',
		caption: 'How Spring Boot wires itself together.',
		nodes: [
			{
				id: 'auto-configuration',
				label: 'Auto-Configuration',
				description: 'How Spring Boot detects your classpath and applies sensible defaults.',
				status: 'available',
				href: '/spring-boot/auto-configuration/overview/',
			},
			{
				id: 'properties',
				label: 'Configuration & Properties',
				description: 'application.yml, property resolution, type-safe binding.',
				status: 'soon',
			},
			{
				id: 'profiles',
				label: 'Profiles',
				description: 'Environment-specific beans and configuration.',
				status: 'soon',
			},
			{
				id: 'application-events',
				label: 'Application Events',
				description: 'Lifecycle events and event-driven customization.',
				status: 'soon',
			},
		],
	},
	{
		id: 'web',
		label: 'Web',
		caption: 'HTTP, controllers, and the request pipeline.',
		nodes: [
			{
				id: 'mvc-rest',
				label: 'MVC & REST',
				description: 'Controllers, request mapping, content negotiation, exception handling.',
				status: 'soon',
			},
			{
				id: 'webflux',
				label: 'WebFlux',
				description: 'Reactive web with Project Reactor and non-blocking IO.',
				status: 'soon',
			},
			{
				id: 'filters',
				label: 'Filters & Interceptors',
				description: 'Request pipeline customization and cross-cutting concerns.',
				status: 'soon',
			},
			{
				id: 'error-handling',
				label: 'Error Handling',
				description: '@ControllerAdvice, ProblemDetail, and consistent error responses.',
				status: 'soon',
			},
		],
	},
	{
		id: 'data',
		label: 'Data',
		caption: 'Persistence, transactions, and query patterns.',
		nodes: [
			{
				id: 'jpa',
				label: 'JPA & Hibernate',
				description: 'Repository patterns, entity mapping, derived queries, JPQL.',
				status: 'soon',
			},
			{
				id: 'jdbc',
				label: 'JDBC',
				description: 'JdbcTemplate, JdbcClient, and direct SQL for control.',
				status: 'soon',
			},
			{
				id: 'transactions',
				label: 'Transactions',
				description: '@Transactional, propagation, isolation, and the proxy model.',
				status: 'soon',
			},
			{
				id: 'migrations',
				label: 'Schema Migrations',
				description: 'Flyway and Liquibase for versioned schema evolution.',
				status: 'soon',
			},
		],
	},
	{
		id: 'security',
		label: 'Security',
		caption: 'Authentication, authorization, and secrets.',
		nodes: [
			{
				id: 'spring-security',
				label: 'Spring Security',
				description: 'SecurityFilterChain, authentication providers, method security.',
				status: 'soon',
			},
			{
				id: 'oauth2',
				label: 'OAuth2 & OIDC',
				description: 'Resource server, client, and authorization server patterns.',
				status: 'soon',
			},
			{
				id: 'secrets',
				label: 'Secrets & Credentials',
				description: 'Externalized secrets, Vault integration, rotation strategy.',
				status: 'soon',
			},
		],
	},
	{
		id: 'testing',
		label: 'Testing',
		caption: 'Unit, slice, and integration tests.',
		nodes: [
			{
				id: 'slice-tests',
				label: 'Slice Tests',
				description: '@WebMvcTest, @DataJpaTest, @JsonTest and their scopes.',
				status: 'soon',
			},
			{
				id: 'integration-tests',
				label: 'Integration Tests',
				description: '@SpringBootTest with Testcontainers for real databases.',
				status: 'soon',
			},
			{
				id: 'mocking',
				label: 'Mocking & Stubbing',
				description: '@MockitoBean, WireMock, and boundary mocking strategies.',
				status: 'soon',
			},
		],
	},
	{
		id: 'observability',
		label: 'Observability',
		caption: 'Health, metrics, tracing, and logs.',
		nodes: [
			{
				id: 'actuator',
				label: 'Actuator',
				description: 'Health, info, metrics, and operational endpoints.',
				status: 'soon',
			},
			{
				id: 'metrics',
				label: 'Metrics & Tracing',
				description: 'Micrometer, Prometheus, OpenTelemetry, and distributed tracing.',
				status: 'soon',
			},
			{
				id: 'logging',
				label: 'Logging',
				description: 'Structured logs, correlation IDs, log levels in production.',
				status: 'soon',
			},
		],
	},
	{
		id: 'deployment',
		label: 'Deployment',
		caption: 'From jar to production, reliably.',
		nodes: [
			{
				id: 'packaging',
				label: 'Packaging',
				description: 'Fat jars, layered jars, buildpacks, native images.',
				status: 'soon',
			},
			{
				id: 'production',
				label: 'Production Tuning',
				description: 'Graceful shutdown, resource sizing, startup optimization.',
				status: 'soon',
			},
			{
				id: 'integrations',
				label: 'Messaging & Integration',
				description: 'Kafka, RabbitMQ, scheduled tasks, async work.',
				status: 'soon',
			},
		],
	},
];
