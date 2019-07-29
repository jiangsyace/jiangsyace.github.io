---
title: Shiro运行原理与Spring集成
date: 2018-8-6 18:01:58
categories:
- tech
tags:
- java
- spring
---

Shiro运行原理与Spring集成 

<!-- more -->

1. 提供的功能
![]({{site.upload | relative_url}}/2018-08-06/index.png)

Authentication：身份认证/登录，验证用户是不是拥有相应的身份；

Authorization：授权，即权限验证，验证某个已认证的用户是否拥有某个权限；即判断用户是否能做事情，常见的如：验证某个用户是否拥有某个角色。或者细粒度的验证某个用户对某个资源是否具有某个权限；

Session Manager：会话管理，即用户登录后就是一次会话，在没有退出之前，它的所有信息都在会话中；会话可以是普通JavaSE环境的，也可以是如Web环境的；

Cryptography：加密，保护数据的安全性，如密码加密存储到数据库，而不是明文存储；

Web Support：Web支持，可以非常容易的集成到Web环境；

Caching：缓存，比如用户登录后，其用户信息、拥有的角色/权限不必每次去查，这样可以提高效率；

Concurrency：shiro支持多线程应用的并发验证，即如在一个线程中开启另一个线程，能把权限自动传播过去；

Testing：提供测试支持；

Run As：允许一个用户假装为另一个用户（如果他们允许）的身份进行访问；

Remember Me：记住我，这个是非常常见的功能，即一次登录后，下次再来的话不用登录了。

2. Shiro架构

从大的角度来看，Shiro有三个主要的概念：Subject，SecurityManager，Realms，下面这幅图可以看到这些原件之间的交互。

![]({{site.upload | relative_url}}/2018-08-06/426671-5458508e59ae958a.png)

Subject：主体，代表了当前参与应用安全部分的主角，可以是用户，可以是第三方服务，可以是cron 任务，或者任何东西。主要指一个正在与当前软件交互的东西。
所有Subject都需要SecurityManager，当你与Subject进行交互，这些交互行为实际上被转换为与SecurityManager的交互

SecurityManager：安全管理器；Shiro架构的核心，它管理着所有Subject；它负责与后边介绍的其他组件进行交互。
请记得，当你与Subject进行交互的时候，实际上是SecurityManager在背后帮你举起Subject来做一些安全操作。

Realms：域；Shiro从从Realm获取安全数据（如用户、角色、权限），可以把Realm看成DataSource，即安全数据源。
Shiro提供了一些可以直接使用的Realms，如果默认的Realms不能满足你的需求，你也可以定制自己的Realms

更细节的架构:

![]({{site.upload | relative_url}}/2018-08-06/426671-d2c043d97b735c9e.png)


3. 与Spring MVC集成  
**Filter：**  

```

@Service
public class FormAuthenticationFilter extends org.apache.shiro.web.filter.authc.FormAuthenticationFilter {
	
	@Override
	protected boolean executeLogin(ServletRequest request, ServletResponse response)
	        throws Exception {
	    return super.executeLogin(request, response);
	}

    @Override
    protected boolean onLoginSuccess(AuthenticationToken token, Subject subject,
            ServletRequest request, ServletResponse response) throws Exception {
        return super.onLoginSuccess(token, subject, request, response);
    }
    
    @Override
	protected AuthenticationToken createToken(ServletRequest request, ServletResponse response) {
		String username = getUsername(request);
		String password = getPassword(request);
		
		if (password==null){
			password = "";
		}
		boolean rememberMe = isRememberMe(request);
		String host = StringUtils.getRemoteAddr((HttpServletRequest)request);
		return new UsernamePasswordToken(username, password.toCharArray(), rememberMe, host);
	}
	
    /**
     * 登录失败调用事件
     */
    @Override
    protected boolean onLoginFailure(AuthenticationToken token,
            AuthenticationException e, ServletRequest request, ServletResponse response) {
        String className = e.getClass().getName(), message = "";
        if (IncorrectCredentialsException.class.getName().equals(className)
                || UnknownAccountException.class.getName().equals(className)){
            message = "用户或密码错误, 请重试.";
        }
        else if (e.getMessage() != null && StringUtils.startsWith(e.getMessage(), "msg:")){
            message = StringUtils.replace(e.getMessage(), "msg:", "");
        }
        else{
            message = "系统出现点问题，请稍后再试！";
            e.printStackTrace(); // 输出到控制台
        }
        request.setAttribute(getFailureKeyAttribute(), className);
        request.setAttribute("message", message);
        return true;
    }
	
	/**
	 * 登录成功之后跳转URL
	 */
	public String getSuccessUrl() {
		return super.getSuccessUrl();
	}
	
	@Override
	protected void issueSuccessRedirect(ServletRequest request,
			ServletResponse response) throws Exception {
		 WebUtils.issueRedirect(request, response, getSuccessUrl(), null, true);
	}  
}  

```

**Realm：**

```

@Service
public class SystemAuthorizingRealm extends AuthorizingRealm {

	@Autowired
    private UserService userService;
	
	/**
	 * 认证回调函数, 获取身份验证信息
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken) {
		UsernamePasswordToken token = (UsernamePasswordToken) authcToken;
		
		// 校验用户名密码
        User user = userService.getByName(token.getUsername());
		if (user != null) {
			byte[] salt = Encodes.decodeHex(user.getPassword().substring(0, 16));
			//交给AuthenticatingRealm使用CredentialsMatcher进行密码匹配，也可以自定义实现  
			return new SimpleAuthenticationInfo(new Principal(user, token.isMobileLogin()), user.getPassword().substring(16), ByteSource.Util.bytes(salt), getName());
//			return new SimpleAuthenticationInfo(new Principal(user, token.isMobileLogin()), user.getPassword(), getName());
		} else {
			throw new UnknownAccountException("没找到账号");
		}
	}

	/**
	 * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		Principal principal = (Principal) getAvailablePrincipal(principals);
		User user = principal.getUser();
		if (user != null) {
			List<String> roleList = new ArrayList<String>();
	        List<String> permissionList = new ArrayList<String>();
	        
	        Set<Role> roles = user.getRoles();
	        if(roles.size()>0) {
	            for(Role role : roles) {
	            	roleList.add(role.getName());
	            	if (null != role.getPermissions()) {
	                    String permissions[] = role.getPermissions().split(",");
	                    // 获取权限
	                    for (String permission : permissions) {
	                        permissionList.add(permission);
	                    }
	                }
	            }
	        }
	        // 为当前用户设置角色和权限
	        SimpleAuthorizationInfo simpleAuthorInfo = new SimpleAuthorizationInfo();
	        simpleAuthorInfo.addRoles(roleList);
	        simpleAuthorInfo.addStringPermissions(permissionList);
	        return simpleAuthorInfo;
		} else {
			return null;
		}
	}
	
	@Override
	protected void checkPermission(Permission permission, AuthorizationInfo info) {
		authorizationValidate(permission);
		super.checkPermission(permission, info);
	}
	
	@Override
	protected boolean[] isPermitted(List<Permission> permissions, AuthorizationInfo info) {
		if (permissions != null && !permissions.isEmpty()) {
            for (Permission permission : permissions) {
        		authorizationValidate(permission);
            }
        }
		return super.isPermitted(permissions, info);
	}
	
	@Override
	public boolean isPermitted(PrincipalCollection principals, Permission permission) {
		authorizationValidate(permission);
		return super.isPermitted(principals, permission);
	}
	
	@Override
	protected boolean isPermittedAll(Collection<Permission> permissions, AuthorizationInfo info) {
		if (permissions != null && !permissions.isEmpty()) {
            for (Permission permission : permissions) {
            	authorizationValidate(permission);
            }
        }
		return super.isPermittedAll(permissions, info);
	}
	
	/**
	 * 授权验证方法
	 * @param permission
	 */
	private void authorizationValidate(Permission permission){
		// 模块授权预留接口
	}
	
	String HASH_ALGORITHM = "SHA-1";
	int HASH_INTERATIONS = 1023;
	int SALT_SIZE = 8;
	
	/**
	 * 设定密码校验的Hash算法与迭代次数
	 */
	@PostConstruct
	public void initCredentialsMatcher() {
		HashedCredentialsMatcher matcher = new HashedCredentialsMatcher(HASH_ALGORITHM);
		matcher.setHashIterations(HASH_INTERATIONS);
		setCredentialsMatcher(matcher);
	}  
}  

```

**spring-shiro.xml：**

```

<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:p="http://www.springframework.org/schema/p"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:mvc="http://www.springframework.org/schema/mvc"
	xsi:schemaLocation="http://www.springframework.org/schema/beans  
                        http://www.springframework.org/schema/beans/spring-beans-4.0.xsd  
                        http://www.springframework.org/schema/context  
                        http://www.springframework.org/schema/context/spring-context-4.0.xsd  
                        http://www.springframework.org/schema/mvc  
                        http://www.springframework.org/schema/mvc/spring-mvc-4.0.xsd" 
						default-lazy-init="true">

	<description>Spring Shiro Configuration</description>
	<!-- 缓存管理 -->
	<bean id="cacheManager" class="org.apache.shiro.cache.MemoryConstrainedCacheManager"></bean>
	
	<!-- Shiro安全管理器 -->
	<bean id="securityManager" class="org.apache.shiro.web.mgt.DefaultWebSecurityManager">
	    <!-- 这里主要是设置自定义的单Realm应用,若有多个Realm,可使用'realms'属性代替 -->
		<property name="realm" ref="systemAuthorizingRealm"></property>
		<property name="cacheManager" ref="cacheManager"></property>
	</bean>
    <bean id="formAuthenticationFilter" class="com.jiangsy.shiro.security.filter.FormAuthenticationFilter">
         <property name="loginFailureFrequentlyHandler" ref="loginFailureFrequentlyHandler"></property>
    </bean>
    <bean id="basicHttpAuthenticationFilter" class="org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter"/>
    <bean id="systemAuthorizingRealm" class="com.jiangsy.shiro.security.realm.SystemAuthorizingRealm"></bean>
	<bean id="shiroFilter" class="org.apache.shiro.spring.web.ShiroFilterFactoryBean">
	    <!-- Shiro的核心安全接口，这个属性是必须的 -->
		<property name="securityManager" ref="securityManager" />
		<!-- 要求登录时的链接(登录页面地址)，非必须的属性，默认会自动寻找Web工程根目录下的"/login.jsp"页面 -->
		<property name="loginUrl" value="/login"></property>
		<!-- 登录成功跳转链接 -->
		<property name="successUrl" value="/user"></property>
		<!-- 登录成功后要跳转的连接(本例中此属性用不到，因为登录成功后的处理逻辑在LoginController里硬编码) -->
		<!-- <property name="successUrl" value="/mydemo/login_success"></property> -->
		<!-- 用户访问未对其授权的资源时，所显示的连接 -->
		<property name="unauthorizedUrl" value="/un_auth"></property>
		<!-- 自定义过滤器 -->
		<property name="filters">
			<map>
				<entry key="authc" value-ref="formAuthenticationFilter" />
				<entry key="outdate" value-ref="sessionOutDateFilter"/>
				<entry key="authcBasic" value-ref="basicHttpAuthenticationFilter"/>
<!-- 	            <entry key="user" value-ref="MyUserAuthenticationFilter"/>                                   -->
			</map>
		</property>
        <!-- 下面value值的第一个'/'代表的路径是相对于HttpServletRequest.getContextPath()的值来的 -->  
        <!-- anon：它对应的过滤器里面是空的,什么都没做,这里.do和.jsp后面的*表示参数,比方说login.jsp?main这种 -->  
        <!-- authc：该过滤器下的页面必须验证后才能访问,它是Shiro内置的一个拦截器org.apache.shiro.web.filter.authc.FormAuthenticationFilter -->
		<property name="filterChainDefinitions">
			<value>
			    ##anon:例子/admins/**=anon 没有参数，表示可以匿名使用
				##/mydemo/**=anon
				##authc:例如/admins/user/**=authc表示需要认证才能使用，没有参数
				##/tag=authc
				##authcBasic：例如/admins/user/**=authcBasic没有参数表示httpBasic认证
				##ssl:例子/admins/user/**=ssl没有参数，表示安全的url请求，协议为https
				##user:例如/admins/user/**=user没有参数表示必须存在用户，但登入操作时不做检查
				##/role/edit/* = perms[role:edit]  
				##/role/save = perms[role:edit]  
				##/role/list = perms[role:view]
				
				/static/** = anon
                /userfiles/** = anon
                
                /custom/** = outdate
				/login=authc
				#/login=authcBasic
                /logout = logout
                /** = user
			</value>
		</property>
	</bean>
	<!-- 保证实现了Shiro内部lifecycle函数的bean执行 -->
	<bean id="lifecycleBeanPostProcessor" class="org.apache.shiro.spring.LifecycleBeanPostProcessor" />
	<bean class="org.springframework.aop.framework.autoproxy.DefaultAdvisorAutoProxyCreator" depends-on="lifecycleBeanPostProcessor">
		<property name="proxyTargetClass" value="true" />
	</bean>
	<bean class="org.apache.shiro.spring.security.interceptor.AuthorizationAttributeSourceAdvisor">
		<property name="securityManager" ref="securityManager" />
	</bean>
</beans>

```

**web.xml**
```
<filter>
    <filter-name>shiroFilter</filter-name>
    <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
    <init-param>
        <!-- 该值缺省为false,表示生命周期由SpringApplicationContext管理,设置为true则表示由ServletContainer管理 -->
        <param-name>targetFilterLifecycle</param-name>
        <param-value>true</param-value>
    </init-param>
</filter>
<filter-mapping>
    <filter-name>shiroFilter</filter-name>
    <url-pattern>/*</url-pattern>
</filter-mapping>
```
4. 与Springboot集成

**ShiroConfig.java**

	/** 
	* Shiro配置
	*/  
	@Configuration  
	public class ShiroConfig {  

		private static final Logger logger = LoggerFactory.getLogger(ShiroConfig.class);
		
		@Bean
		public FilterRegistrationBean delegatingFilterProxy(){
			FilterRegistrationBean filterRegistrationBean = new FilterRegistrationBean();
			DelegatingFilterProxy proxy = new DelegatingFilterProxy();
			proxy.setTargetFilterLifecycle(true);
			proxy.setTargetBeanName("shiroFilter");
			filterRegistrationBean.setFilter(proxy);
			return filterRegistrationBean;
		}
		
		/**
		* FilterName  Class
		* anon        org.apache.shiro.web.filter.authc.AnonymousFilter
		* authc       org.apache.shiro.web.filter.authc.FormAuthenticationFilter
		* authcBasic  org.apache.shiro.web.filter.authc.BasicHttpAuthenticationFilter
		* perms       org.apache.shiro.web.filter.authz.PermissionsAuthorizationFilter
		* port        org.apache.shiro.web.filter.authz.PortFilter
		* rest        org.apache.shiro.web.filter.authz.HttpMethodPermissionFilter
		* roles       org.apache.shiro.web.filter.authz.RolesAuthorizationFilter
		* ssl         org.apache.shiro.web.filter.authz.SslFilter
		* user        org.apache.shiro.web.filter.authc.UserFilter
		* @param securityManager
		* @return
		*/
		@Bean("shiroFilter")
		public ShiroFilterFactoryBean shiroFilter(@Qualifier("securityManager")SecurityManager securityManager) {  
			logger.info("====>ShiroConfiguration.shirFilter()");  
			ShiroFilterFactoryBean shiroFilterFactoryBean = new ShiroFilterFactoryBean();  
			shiroFilterFactoryBean.setSecurityManager(securityManager);  
			
			//配置shiro默认登录界面地址，前后端分离中登录界面跳转应由前端路由控制，后台仅返回json数据  
			shiroFilterFactoryBean.setLoginUrl("/login");  
			// 登录成功后要跳转的链接  
			shiroFilterFactoryBean.setSuccessUrl("/user");  
			//未授权界面 
			shiroFilterFactoryBean.setUnauthorizedUrl("/unauth");
	
			//配置过滤器
			Map<String, Filter> filters = new LinkedHashMap<String, Filter>();
			LogoutFilter logoutFilter = new LogoutFilter();
			logoutFilter.setRedirectUrl("/login");
			filters.put("logout", logoutFilter);

			FormAuthenticationFilter authcFilter = new FormAuthenticationFilter();
			filters.put("authc", authcFilter);
			shiroFilterFactoryBean.setFilters(filters);
			
			//配置访问权限
			//filterChainDefinitionMap必须是LinkedHashMap因为它必须保证有序
			Map<String, String> filterChainDefinitionMap = new LinkedHashMap<String, String>();
			//注意过滤器配置顺序 不能颠倒  

			// 配置不会被拦截的链接 顺序判断  
			filterChainDefinitionMap.put("/static/**", "anon");
			filterChainDefinitionMap.put("/hello", "anon");
			filterChainDefinitionMap.put("/index", "anon");
			//配置退出 过滤器,其中的具体的退出代码Shiro已经替我们实现了，登出后跳转配置的loginUrl  
			filterChainDefinitionMap.put("/logout", "logout");
			filterChainDefinitionMap.put("/login", "authc");
			//用户，需要角色权限 “user”
			filterChainDefinitionMap.put("/user/**", "authc,roles[user]");

			filterChainDefinitionMap.put("/auth/**", "authcBasic");
			
			//主要这行代码必须放在所有权限设置的最后，不然会导致所有 url 都被拦截
			filterChainDefinitionMap.put("/**", "user");
			shiroFilterFactoryBean.setFilterChainDefinitionMap(filterChainDefinitionMap);
			return shiroFilterFactoryBean;
		}  
	
		//配置核心安全事务管理器
		@Bean(name="securityManager")
		public SecurityManager securityManager(@Qualifier("authRealm") AuthRealm authRealm) {
			logger.info("====>securityManager已经加载");
			DefaultWebSecurityManager manager = new DefaultWebSecurityManager();
			manager.setRealm(authRealm);
			return manager;
		}
		
		//配置自定义的权限登录器
		@Bean(name="authRealm")
		public AuthRealm authRealm(@Qualifier("credentialsMatcher") HashedCredentialsMatcher matcher) {
			AuthRealm authRealm = new AuthRealm();
			authRealm.setCredentialsMatcher(matcher);
			return authRealm;
		}
		
		/**  
		* 凭证匹配器  
		* （由于我们的密码校验交给Shiro的SimpleAuthenticationInfo进行处理了）  
		* @return  
		*/  
		@Bean(name = "credentialsMatcher")
		public HashedCredentialsMatcher hashedCredentialsMatcher() {  
			HashedCredentialsMatcher hashedCredentialsMatcher = new HashedCredentialsMatcher();  
			hashedCredentialsMatcher.setHashAlgorithmName("SHA-1");//散列算法:SHA-1,MD5
			hashedCredentialsMatcher.setHashIterations(1023);//散列的次数
			return hashedCredentialsMatcher;  
		}  

		@Bean
		public LifecycleBeanPostProcessor lifecycleBeanPostProcessor(){
			return new LifecycleBeanPostProcessor();
		}
		@Bean
		public DefaultAdvisorAutoProxyCreator defaultAdvisorAutoProxyCreator(){
			DefaultAdvisorAutoProxyCreator creator=new DefaultAdvisorAutoProxyCreator();
			creator.setProxyTargetClass(true);
			return creator;
		}
		/** 
		* 开启shiro aop注解支持. 
		* 使用代理方式;所以需要开启代码支持; 
		* @param securityManager 
		* @return 
		*/  
		@Bean  
		public AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor(SecurityManager securityManager) {  
			AuthorizationAttributeSourceAdvisor authorizationAttributeSourceAdvisor = new AuthorizationAttributeSourceAdvisor();  
			authorizationAttributeSourceAdvisor.setSecurityManager(securityManager);  
			return authorizationAttributeSourceAdvisor;  
		}  
	}

## 参考

[http://shiro.apache.org/architecture.html](http://shiro.apache.org/architecture.html)

