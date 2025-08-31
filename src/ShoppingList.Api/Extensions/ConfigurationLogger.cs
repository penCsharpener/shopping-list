using System.Reflection;
using Microsoft.Extensions.Configuration.Json;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace ShoppingList.Api.Extensions;

public class ConfigurationLogger
{
    private readonly ConfigurationManager _configurationManager;
    private readonly ILogger<ConfigurationLogger> _logger;

    public ConfigurationLogger(ConfigurationManager configurationManager, ILogger<ConfigurationLogger> logger)
    {
        _configurationManager = configurationManager;
        _logger = logger;
    }

    public void LogConfiguration()
    {
        _logger.LogInformation("Configuration values:");

        // loop through configuration sources

        int index = 0;

        var configurationRoot = (IConfigurationRoot)_configurationManager;
        var configurationBuilder = (IConfigurationBuilder)_configurationManager;

        foreach (var provider in configurationRoot.Providers)
        {
            _logger.LogInformation("{Index,2}.: {Provider}", ++index, provider);

            if (provider is JsonConfigurationProvider jsonProvider && jsonProvider.Source.Path == "secrets.json")
            {
                var secretsId = typeof(Program).Assembly.GetCustomAttribute<UserSecretsIdAttribute>()?.UserSecretsId ??
                                Guid.Empty.ToString();
                _logger.LogInformation("File path: {Path}", PathHelper.GetSecretsPathFromSecretsId(secretsId));
            }
        }

        foreach (var provider in ((IConfigurationRoot)_configurationManager).Providers)
        {
            _logger.LogInformation(string.Empty.PadLeft(130, '='));
            _logger.LogInformation("{Index,2}.: {Provider}", ++index, provider);

            var nonPublicValues = GetNonPublicValues(provider);

            if (nonPublicValues is null)
            {
                continue;
            }

            if (provider is JsonConfigurationProvider jsonProvider && jsonProvider.Source.Path == "secrets.json")
            {
                var secretsId = typeof(Program).Assembly.GetCustomAttribute<UserSecretsIdAttribute>()?.UserSecretsId ??
                                Guid.Empty.ToString();
                _logger.LogInformation("File path: {Path}", PathHelper.GetSecretsPathFromSecretsId(secretsId));
            }

            foreach (var kv in nonPublicValues)
            {
                _logger.LogInformation("{Key}: {Value}", kv.Key.PadLeft(60), kv.Value);
            }
        }

        _logger.LogInformation(string.Empty.PadLeft(130, '='));
        _logger.LogInformation("  Effective configuration  ".PadLeft(50, '=').PadRight(50, '='));

        foreach (var kv in ((IConfiguration)_configurationManager).AsEnumerable()
                 .Where(x => x.Value is not null)
                 .OrderBy(x => x.Key))
        {
            _logger.LogInformation("{Key}: {Value}", kv.Key.PadLeft(60), kv.Value);
        }

        _logger.LogInformation(string.Empty.PadLeft(130, '='));
    }

    private IDictionary<string, string>? GetNonPublicValues(IConfigurationProvider provider)
    {
        var dataProperty = provider.GetType().GetProperty("Data", BindingFlags.NonPublic | BindingFlags.Instance);
        return dataProperty?.GetValue(provider) as IDictionary<string, string>;
    }
}